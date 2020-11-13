module.exports = {
  info: {
    title: "Product Service",
    version: "1.0.0",
    description: "Product Service for Nodejs in AWS course",
  },
  apis: [
    "./handlers/getProductsList/index.ts",
    "./handlers/getProductsById/index.ts",
    "./handlers/createProduct/index.ts",
  ],
  host: "fgkaarac1j.execute-api.eu-west-1.amazonaws.com",
  basePath: "/dev",
};
