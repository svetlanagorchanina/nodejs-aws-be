import { APIGatewayProxyResult } from "aws-lambda";

export const withCorsHeaders = (response: APIGatewayProxyResult) => ({
  ...response,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,PUT,POST",
    ...(response.headers || {}),
  },
});
