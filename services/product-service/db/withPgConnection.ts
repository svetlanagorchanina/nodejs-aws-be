import { APIGatewayProxyResult } from "aws-lambda";
import { Pool } from "pg";
import { withCorsHeaders } from "../../utils/withCorsHeaders";
import { DB_OPTIONS } from "./options";

let pool;

export const withPgConnection = (handler) => async (
  ...args
): Promise<APIGatewayProxyResult> => {
  if (!pool) {
    pool = new Pool(DB_OPTIONS);
  }

  const client = await pool.connect();

  try {
    return await handler(client, ...args);
  } catch (err) {
    console.log("Error:", err?.message);
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
