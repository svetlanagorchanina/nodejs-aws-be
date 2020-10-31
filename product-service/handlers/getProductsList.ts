import { APIGatewayProxyHandler } from "aws-lambda";
import "source-map-support/register";
import productList from "../data/productList.json";

export const getProductsList: APIGatewayProxyHandler = async () => ({
  statusCode: 200,
  headers: {
    "Access-Control-Allow-Origin": "*",
  },
  body: JSON.stringify(productList),
});
