import "source-map-support/register";
import productList from "../../data/productList.json";
import { withCorsHeaders } from "../../utils/withCorsHeaders";

export const getProductsById = async (event) => {
  try {
    const product = productList.find(
      ({ id }) => id === event.pathParameters.id
    );

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
  } catch (e) {
    return withCorsHeaders({
      statusCode: 500,
      body: JSON.stringify({
        message: "Something went wrong. Please try again later.",
      }),
    });
  }
};
