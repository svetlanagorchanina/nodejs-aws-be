import { SNS } from "aws-sdk";
import { productsQuery } from "../../db/model/products";
import { stocksQuery } from "../../db/model/stocks";
import { withPgConnection } from "../../db/withPgConnection";

const { REGION, SNS_ARN } = process.env;

type CreatProductStatus = "OK" | "ERROR";

export const catalogBatchProcess = withPgConnection(async (client, event) => {
  const products = event.Records.map(({ body }) => JSON.parse(body));

  await Promise.all(
    products.map(async (product) => {
      let status: CreatProductStatus = "OK";

      try {
        await addProductToDb(client, product);
      } catch (error) {
        status = "ERROR";
        console.log("DB error:", error?.message);
      }

      try {
        await publishMessageToSNS(product, status);
      } catch (error) {
        console.log("SNS error: ", error);
      }
    })
  );
});

const publishMessageToSNS = ({ title }, status: CreatProductStatus) => {
  const sns = new SNS({ region: REGION });

  return sns
    .publish({
      Subject: "New products announcement",
      Message:
        status === "OK"
          ? `The following product was added to Christmas store:\n${title}`
          : `The following product was not saved:\n${title}`,
      TopicArn: SNS_ARN,
      MessageAttributes: {
        status: {
          DataType: "String",
          StringValue: status,
        },
      },
    })
    .promise();
};

const addProductToDb = async (client, product) => {
  const { title, price, count, description, src } = formatProduct(product);

  if (!isProductValid({ title, price, count })) {
    throw new Error(`Product ${title} is not valid`);
  }

  const {
    rows: [{ id }],
  } = await client.query(productsQuery.addRow, [
    title,
    description,
    price,
    src,
  ]);
  await client.query(stocksQuery.addRow, [id, count]);

  console.log(`Product ${title} was created`);
};

const formatProduct = ({
  title,
  price,
  count,
  description = "",
  src = "",
}) => ({
  title,
  price: parseInt(price, 10),
  count: parseInt(count, 10),
  description,
  src,
});

const isProductValid = ({ title, price, count }) =>
  title &&
  count >= 0 &&
  Number.isInteger(count) &&
  price >= 0 &&
  Number.isInteger(price);
