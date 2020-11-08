import { Client } from "pg";
import { productsQuery } from "../db/model/products";
import { stocksQuery } from "../db/model/stocks";

const { PG_HOST, PG_PORT, PG_DATABASE, PG_USERNAME, PG_PASSWORD } = process.env;
const dbOptions = {
  host: PG_HOST,
  port: PG_PORT,
  database: PG_DATABASE,
  user: PG_USERNAME,
  password: PG_PASSWORD,
  ssl: {
    rejectUnauthorized: false,
  },
  connectionTimeoutMillis: 5000,
};

export const pgInit = async () => {
  const client = new Client(dbOptions);
  await client.connect();

  try {
    await client.query(productsQuery.createTable);
    await client.query(stocksQuery.createTable);
    await client.query(productsQuery.insertInitData);
    await client.query(stocksQuery.insertInitData);

    const { rows: products } = await client.query(productsQuery.getAll);
    console.log("Products:", products);
  } catch (err) {
    console.error("Error during database request executing:", err);
  } finally {
    client.end();
  }
};
