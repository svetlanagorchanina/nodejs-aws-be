import "source-map-support/register";
import productList from "../../data/productList.json";
import { withCorsHeaders } from "../../utils/withCorsHeaders";
import fetch from "node-fetch";

const RANDOM_NUMBER_API =
  "http://www.randomnumberapi.com/api/v1.0/random?min=1&max=100";

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
 *         default: 7567ec4b-b10c-48c5-9345-fc73c48a80aa
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
export const getProductsById = async (event) => {
  try {
    const product = productList.find(
      ({ id }) => id === event.pathParameters.id
    );
    const randomCounts = await fetch(RANDOM_NUMBER_API).then((res) =>
      res.json()
    );

    return withCorsHeaders(
      product
        ? {
            statusCode: 200,
            body: JSON.stringify({ ...product, count: randomCounts[0] }),
          }
        : {
            statusCode: 404,
            body: JSON.stringify({ message: "Product not found" }),
          }
    );
  } catch (e) {
    return withCorsHeaders({
      statusCode: 500,
      body: JSON.stringify({
        message: "Something went wrong. Please try again later.",
      }),
    });
  }
};
