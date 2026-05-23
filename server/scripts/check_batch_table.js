import { Sequelize } from 'sequelize';
import { env } from '../src/config/env.js';

const sequelize = new Sequelize(env.db.name, env.db.user, env.db.pass, {
  host: env.db.host,
  port: env.db.port,
  dialect: 'mysql',
  logging: false,
});

async function check() {
  const [desc] = await sequelize.query(`DESCRIBE batch_inventory;`);
  console.log("Schema:", desc);

  const [rows] = await sequelize.query(`SELECT * FROM batch_inventory LIMIT 10;`);
  console.log("Rows:", rows);

  const [count] = await sequelize.query(`SELECT COUNT(*) as c FROM batch_inventory;`);
  console.log("Total rows:", count[0].c);

  const [negative] = await sequelize.query(`SELECT COUNT(*) as c FROM batch_inventory WHERE quantity <= 0;`);
  console.log("Zero/Negative rows:", negative[0].c);

  const [dupes] = await sequelize.query(`
    SELECT batch_id, warehouse_id, COUNT(*) as c
    FROM batch_inventory
    GROUP BY batch_id, warehouse_id
    HAVING c > 1;
  `);
  console.log("Duplicates:", dupes);

  process.exit(0);
}
check();
