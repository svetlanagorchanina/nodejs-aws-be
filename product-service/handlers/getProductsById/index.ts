import "source-map-support/register";
import { productsQuery } from "../../db/model/products";
import { withCorsHeaders } from "../../utils/withCorsHeaders";
import { withPgConnection } from "../../db/withPgConnection";
import { withEventLog } from "../../utils/withEventLog";

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
 * /products/{id}:
 *   get:
 *     description: Get product
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Product id
 *         required: true
 *         type: string
 *         in: path
 *     responses:
 *       200:
 *         description: OK
 *         schema:
 *           $ref: "#/definitions/Product"
 *       404:
 *         description: A product with the specified ID was not found
 *         schema:
 *           $ref: "#/definitions/Error"
 *       500:
 *         description: Something went wrong. Please try again later
 *         schema:
 *            $ref: "#/definitions/Error"
 */
export const getProductsById = withEventLog(
  withPgConnection(async (client, event) => {
    const id = event.pathParameters.id;
    let product;

    try {
      const { rows } = await client.query(productsQuery.getById, [id]);
      product = rows[0];
    } catch (error) {}

    return withCorsHeaders(
      product
        ? {
            statusCode: 200,
            body: JSON.stringify(product),
          }
        : {
            statusCode: 404,
            body: JSON.stringify({ message: "Product not found" }),
          }
    );
  }),
  "getProductsById"
);
