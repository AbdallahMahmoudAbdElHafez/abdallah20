import { Sequelize } from 'sequelize';
import { env } from '../src/config/env.js';

const sequelize = new Sequelize(env.db.name, env.db.user, env.db.pass, {
  host: env.db.host,
  port: env.db.port,
  dialect: 'mysql',
  logging: false,
});

async function checkProd6() {
  const [trx] = await sequelize.query(`
    SELECT t.id, t.transaction_type, b.batch_id, b.quantity as batch_qty
    FROM inventory_transactions t
    LEFT JOIN inventory_transaction_batches b ON t.id = b.inventory_transaction_id
    WHERE t.product_id = 6 AND t.warehouse_id = 10
  `);
  console.log("All transactions for product 6 warehouse 10:");
  console.table(trx);

  process.exit(0);
}
checkProd6();
