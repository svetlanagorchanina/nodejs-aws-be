import { productsQuery } from "../../db/model/products";
import { stocksQuery } from "../../db/model/stocks";
import { withPgConnection } from "../../db/withPgConnection";
import { withEventLog } from "../../utils/withEventLog";

export const dbInit = withEventLog(
  withPgConnection(async (client) => {
    await client.query(stocksQuery.dropTable);
    await client.query(productsQuery.dropTable);

    await client.query(productsQuery.createTable);
    await client.query(stocksQuery.createTable);

    await client.query(productsQuery.insertInitData);
    await client.query(stocksQuery.insertInitData);

    const { rows: products } = await client.query(productsQuery.getAll);
    console.log("Products:", products);
  }),
  "dbInit"
);
