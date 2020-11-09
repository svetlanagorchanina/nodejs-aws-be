import { Product } from "../../model/Product";

const dropTable = "drop table if exists stocks;";

const createTable = `
    create table stocks (
        product_id uuid primary key,
        count integer,
        foreign key ("product_id") references "products" ("id")
    );
`;

const insertInitData = `
    insert into stocks (product_id, count)
            select id, 4 from products WHERE title='Christmas Tree'
        union 
            select id, 6 from products WHERE title='Spirit'
        union 
            select id, 7 from products WHERE title='Toy'
        union 
            select id, 12 from products WHERE title='Balls'
        union 
            select id, 7 from products WHERE title='Nutcracker'
        union 
            select id, 8 from products WHERE title='Socks'
        union 
            select id, 2 from products WHERE title='Mug'
        union 
            select id, 3 from products WHERE title='Сinnamon';
`;

const addRow = "insert into stocks (product_id, count) values ($1, $2);";

export const stocksQuery = {
  dropTable,
  createTable,
  insertInitData,
  addRow,
};
