import { APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";
import { Pool } from "pg";
import { withCorsHeaders } from "../../utils/withCorsHeaders";
import { DB_OPTIONS } from "./options";

let pool;

export const withPgConnection = (handler): APIGatewayProxyHandler => async (
  ...args
): Promise<APIGatewayProxyResult> => {
  if (!pool) {
    pool = new Pool(DB_OPTIONS);
  }

  const client = await pool.connect();

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
    client.release();
  }
};
