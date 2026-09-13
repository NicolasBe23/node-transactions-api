import knex from "knex";
import type { Knex } from "knex";
import { env } from "./env/index.js";

if (!env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set.");
}

export const config: Knex.Config = {
  client: "sqlite",
  connection: {
    filename: env.DATABASE_URL,
  },
  useNullAsDefault: true,
  migrations: {
    extension: "ts",
    directory: "./db/migrations",
  },
};

export const knexInstance = knex(config);
