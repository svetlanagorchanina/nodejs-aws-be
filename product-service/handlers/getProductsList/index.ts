import { APIGatewayProxyHandler } from "aws-lambda";
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
 * /products:
 *   get:
 *     description: Get product list
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: OK
 *         schema:
 *           type: array
 *           items:
 *              $ref: "#/definitions/Product"
 *       404:
 *          description: Product list not found
 *          schema:
 *              $ref: "#/definitions/Error"
 *       500:
 *          description: Something went wrong
 *          schema:
 *              $ref: "#/definitions/Error"
 */
export const getProductsList: APIGatewayProxyHandler = withEventLog(
  withPgConnection(async (client) => {
    const { rows: products } = await client.query(
      productsQuery.getAllWithCount
    );

    return withCorsHeaders(
      products
        ? {
            statusCode: 200,
            body: JSON.stringify(products),
          }
        : {
            statusCode: 404,
            body: JSON.stringify({ message: "Product list not found" }),
          }
    );
  }),
  "getProductsList"
);
