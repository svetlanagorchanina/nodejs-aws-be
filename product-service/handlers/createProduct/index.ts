import "source-map-support/register";
import { productsQuery } from "../../db/model/products";
import { withCorsHeaders } from "../../utils/withCorsHeaders";
import { withPgConnection } from "../../db/withPgConnection";
import { APIGatewayProxyHandler } from "aws-lambda";
import { stocksQuery } from "../../db/model/stocks";
import { withEventLog } from "../../utils/withEventLog";

const isProductValid = ({ title, price, count }) =>
  title &&
  count >= 0 &&
  Number.isInteger(count) &&
  price >= 0 &&
  Number.isInteger(price);

export const createProduct: APIGatewayProxyHandler = withEventLog(
  withPgConnection(async (client, event) => {
    const { title, description = "", price, src = "", count } = JSON.parse(
      event.body
    );
    let productId;

    if (!isProductValid({ title, price, count })) {
      return withCorsHeaders({
        statusCode: 400,
        body: JSON.stringify({ message: "Product is not valid" }),
      });
    }

    try {
      client.query("BEGIN");
      const {
        rows: [{ id }],
      } = await client.query(
        productsQuery.addRow({ title, description, price, src })
      );
      productId = id;
      await client.query(stocksQuery.addRow({ id, count }));
      client.query("COMMIT");
    } catch (e) {
      client.query("ROLLBACK");
      throw e;
    }

    const {
      rows: [product],
    } = await client.query(productsQuery.getById(productId));

    return withCorsHeaders({
      statusCode: 200,
      body: JSON.stringify(product),
    });
  }),
  "createProduct"
);
