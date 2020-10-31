import { withCorsHeaders } from "../../utils/withCorsHeaders";
import { getProductsById } from ".";

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

jest.mock("../../data/productList.json", () => [
  {
    count: 1,
    description: "Description",
    id: "1",
    price: 10,
    title: "Toy",
    src: "url",
  },
]);

describe("#getProductsById", () => {
  it("should return product if it exists", async () => {
    const response = await getProductsById({
      pathParameters: { id: mockProductList[0].id },
    });

    expect(response).toEqual(
      withCorsHeaders({
        statusCode: 200,
        body: JSON.stringify(mockProductList[0]),
      })
    );
  });

  it("should return status 404 if product is not found", async () => {
    const response = await getProductsById({
      pathParameters: { id: "not valid id" },
    });

    expect(response).toMatchObject(withCorsHeaders({ statusCode: 404 } as any));
  });

  it("should return status 500 if something went wrong", async () => {
    const response = await getProductsById({});

    expect(response).toMatchObject(withCorsHeaders({ statusCode: 500 } as any));
  });
});
