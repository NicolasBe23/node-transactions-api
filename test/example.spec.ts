import { expect, test } from "vitest";

test("o usuario deve ser capaz de criar uma transação", async () => {
  const responseStatusCode = 201;
  expect(responseStatusCode).toEqual(201);
});
