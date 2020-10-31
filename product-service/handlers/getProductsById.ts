import { APIGatewayProxyHandler } from "aws-lambda";
import "source-map-support/register";
import productList from "../data/productList.json";

export const getProductsById: APIGatewayProxyHandler = async ({
  pathParameters,
}) => {
  const product = productList.find(({ id }) => id === pathParameters?.id);

  return product
    ? {
        statusCode: 200,
        body: JSON.stringify(product),
      }
    : {
        statusCode: 404,
        body: JSON.stringify({ message: "Product not found" }),
      };
};
