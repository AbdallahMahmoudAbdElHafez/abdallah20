import { Sequelize } from 'sequelize';
import { env } from '../src/config/env.js';

const sequelize = new Sequelize(env.db.name, env.db.user, env.db.pass, {
  host: env.db.host,
  port: env.db.port,
  dialect: 'mysql',
  logging: false,
});

async function findMismatches() {
  const [rows] = await sequelize.query(`
    SELECT t.id as trx_id, t.product_id as t_product, b.batch_id, b.quantity, batches.product_id as b_product
    FROM inventory_transactions t
    JOIN inventory_transaction_batches b ON t.id = b.inventory_transaction_id
    LEFT JOIN batches ON b.batch_id = batches.id
    WHERE t.product_id != batches.product_id OR batches.id IS NULL
  `);

  console.log("Mismatched or Missing Batches:", rows);
  process.exit(0);
}
findMismatches();
