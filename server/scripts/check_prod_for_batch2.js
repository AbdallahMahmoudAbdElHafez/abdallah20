import { Sequelize } from 'sequelize';
import { env } from '../src/config/env.js';

const sequelize = new Sequelize(env.db.name, env.db.user, env.db.pass, {
  host: env.db.host,
  port: env.db.port,
  dialect: 'mysql',
  logging: false,
});

async function check() {
  const [trx] = await sequelize.query(`
    SELECT t.id, t.product_id, t.transaction_type, b.quantity
    FROM inventory_transactions t
    JOIN inventory_transaction_batches b ON t.id = b.inventory_transaction_id
    WHERE b.batch_id = 2 AND t.warehouse_id = 10
  `);
  console.log("Products in transactions for batch 2:", trx.map(t => t.product_id));

  process.exit(0);
}
check();
