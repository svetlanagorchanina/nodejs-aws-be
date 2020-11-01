import { APIGatewayProxyHandler } from "aws-lambda";
import "source-map-support/register";
import productList from "../../data/productList.json";
import { withCorsHeaders } from "../../utils/withCorsHeaders";

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
 */
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
