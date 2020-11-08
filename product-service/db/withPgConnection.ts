import { APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";
import { Client } from "pg";
import { withCorsHeaders } from "../utils/withCorsHeaders";
import { DB_OPTIONS } from "./options";

export const withPgConnection = (handler): APIGatewayProxyHandler => async (
  ...args
): Promise<APIGatewayProxyResult> => {
  const client = new Client(DB_OPTIONS);
  await client.connect();

  try {
    return await handler(client, ...args);
  } catch (err) {
    return withCorsHeaders({
      statusCode: 500,
      body: JSON.stringify({
        message:
          err?.message || "Something went wrong. Please try again later.",
      }),
    });
  } finally {
    client.end();
  }
};
