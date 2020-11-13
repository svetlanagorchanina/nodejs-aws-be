import { withCorsHeaders } from "../../utils/withCorsHeaders";
import { APIGatewayProxyResult } from "aws-lambda";

const mockProductList = [
  {
    count: 1,
    description: "Description",
    id: "1",
    price: 10,
    title: "Toy",
    src: "url",
  },
];

describe("#getProductsById", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it("should return product if it exists", async () => {
    jest.mock("../../db/withPgConnection", () => ({
      withPgConnection: (handler) => (...args) =>
        handler({ query: async () => ({ rows: mockProductList }) }, ...args),
    }));
    const { getProductsById } = require(".");
    const targetProduct = mockProductList[0];

    const response = await getProductsById({
      pathParameters: { id: targetProduct.id },
    });

    expect(response).toMatchObject(
      withCorsHeaders({
        statusCode: 200,
        body: JSON.stringify(targetProduct),
      })
    );
  });

  it("should return status 404 if product is not found", async () => {
    jest.mock("../../db/withPgConnection", () => ({
      withPgConnection: (handler) => (...args) =>
        handler({ query: async () => ({ rows: [null] }) }, ...args),
    }));
    const { getProductsById } = require(".");
    const response = await getProductsById({
      pathParameters: { id: "not valid id" },
    });

    expect(response).toMatchObject(
      withCorsHeaders({ statusCode: 404 } as APIGatewayProxyResult)
    );
  });
});
