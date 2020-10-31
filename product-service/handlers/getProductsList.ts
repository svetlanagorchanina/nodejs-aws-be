import { APIGatewayProxyHandler } from "aws-lambda";
import "source-map-support/register";
import productList from "../data/productList.json";
import { withCorsHeaders } from "../utils/withCorsHeaders";

export const getProductsList: APIGatewayProxyHandler = async () =>
  withCorsHeaders(
    productList
      ? {
          statusCode: 200,
          body: JSON.stringify(productList),
        }
      : {
          statusCode: 404,
          body: JSON.stringify({ message: "Product list not found" }),
        }
  );
