import type { FastifyInstance } from "fastify";
import { knexInstance } from "../database.js";
import { z } from "zod";
import { randomUUID } from "node:crypto";
import { checkSessionIdExist } from "../middlewares/check-session-id-exist.js";

export async function transactionsRoutes(app: FastifyInstance) {
  (app.addHook("preHandler", async (request) => {
    console.log(`[${request.method}] ${request.url}`);
  }),
    app.get("/", { preHandler: [checkSessionIdExist] }, async (request) => {
      const sessionId = request.cookies.sessionId;
      const transactions = await knexInstance("transactions")
        .where("session_id", sessionId)
        .select("*");

      return { transactions };
    }));

  app.get("/:id", { preHandler: [checkSessionIdExist] }, async (request) => {
    const getTransactionParamsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = getTransactionParamsSchema.parse(request.params);

    const sessionId = request.cookies.sessionId;

    const transaction = await knexInstance("transactions")
      .where({ id, session_id: sessionId })
      .first();

    return { transaction };
  });

  app.get(
    "/summary",
    { preHandler: [checkSessionIdExist] },
    async (request) => {
      const sessionId = request.cookies.sessionId;
      const summary = await knexInstance("transactions")
        .where("session_id", sessionId)
        .sum("amount", { as: "amount" })
        .first();

      return { summary };
    },
  );

  app.post(
    "/",
    { preHandler: [checkSessionIdExist] },
    async (request, reply) => {
      const createTransactionBodySchema = z.object({
        title: z.string(),
        amount: z.number(),
        type: z.enum(["credit", "debit"]),
      });

      const { title, amount, type } = createTransactionBodySchema.parse(
        request.body,
      );

      let sessionId = request.cookies.sessionId;

      if (!sessionId) {
        sessionId = randomUUID();

        reply.cookie("sessionId", sessionId, {
          path: "/",
          maxAge: 60 * 60 * 24 * 7,
        });
      }

      await knexInstance("transactions").insert({
        id: randomUUID(),
        title,
        amount: type === "credit" ? amount : amount * -1,
        type,
        session_id: sessionId,
      });

      return reply.status(201).send();
    },
  );
}
