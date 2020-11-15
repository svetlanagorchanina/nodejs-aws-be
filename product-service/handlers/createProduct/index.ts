import "source-map-support/register";
import { productsQuery } from "../../db/model/products";
import { withCorsHeaders } from "../../../utils/withCorsHeaders";
import { withPgConnection } from "../../db/withPgConnection";
import { APIGatewayProxyHandler } from "aws-lambda";
import { stocksQuery } from "../../db/model/stocks";
import { withEventLog } from "../../../utils/withEventLog";

/**
 * @swagger
 * definitions:
 *   Product:
 *     required:
 *       - count
 *       - id
 *       - price
 *       - title
 *       - src
 *     properties:
 *       count:
 *          type: number
 *       description:
 *          type: string
 *       id:
 *         type: string
 *       price:
 *          type: number
 *       title:
 *         type: string
 *       src:
 *         type: string
 *   Error:
 *     required:
 *       - message
 *     properties:
 *       message:
 *         type: string
 */

/**
 * @swagger
 *
 * /products:
 *   post:
 *     description: Create product
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: product
 *         description: The product to create
 *         in: body
 *         schema:
 *           type: object
 *           required:
 *             - title
 *             - count
 *             - price
 *           properties:
 *             title:
 *               type: string
 *               default: "Christmas Product 1"
 *             count:
 *               type: number
 *               default: 5
 *             price:
 *               type: number
 *               default: 17
 *             src:
 *               type: string
 *               default: "https://m.hindustantimes.com/rf/image_size_960x540/HT/p2/2017/12/24/Pictures/_c0e2aa88-e88e-11e7-b094-c21f82b60b0b.jpg"
 *             description:
 *               type: string
 *     responses:
 *       200:
 *         description: OK
 *         schema:
 *           $ref: "#/definitions/Product"
 *       400:
 *         description: Product is not valid
 *         schema:
 *           $ref: "#/definitions/Error"
 *       500:
 *         description: Something went wrong. Please try again later
 *         schema:
 *            $ref: "#/definitions/Error"
 */
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
      } = await client.query(productsQuery.addRow, [
        title,
        description,
        price,
        src,
      ]);
      productId = id;
      await client.query(stocksQuery.addRow, [id, count]);
      client.query("COMMIT");
    } catch (e) {
      client.query("ROLLBACK");
      throw e;
    }

    const {
      rows: [product],
    } = await client.query(productsQuery.getById, [productId]);

    return withCorsHeaders({
      statusCode: 200,
      body: JSON.stringify(product),
    });
  }),
  "createProduct"
);

const isProductValid = ({ title, price, count }) =>
  title &&
  count >= 0 &&
  Number.isInteger(count) &&
  price >= 0 &&
  Number.isInteger(price);
