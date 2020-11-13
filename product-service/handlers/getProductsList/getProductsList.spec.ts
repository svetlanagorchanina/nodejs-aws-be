import { APIGatewayProxyResult } from "aws-lambda";
import { withCorsHeaders } from "../../utils/withCorsHeaders";

describe("#getProductsList", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it("should return products list if it exists", async () => {
    jest.mock("../../db/withPgConnection", () => ({
      withPgConnection: (handler) => (...args) =>
        handler({ query: async () => ({ rows: [] }) }, ...args),
    }));
    const { getProductsList } = require(".");

    const response = await getProductsList();

    expect(response).toEqual(
      withCorsHeaders({
        statusCode: 200,
        body: JSON.stringify([]),
      })
    );
  });

  it("should return error if product list is undefined", async () => {
    jest.mock("../../db/withPgConnection", () => ({
      withPgConnection: (handler) => (...args) =>
        handler({ query: async () => ({ rows: undefined }) }, ...args),
    }));
    const { getProductsList } = require(".");

    const response = await getProductsList();

    expect(response).toMatchObject(
      withCorsHeaders({ statusCode: 404 } as APIGatewayProxyResult)
    );
  });
});
