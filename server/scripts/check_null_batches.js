import { Sequelize } from 'sequelize';
import { env } from '../src/config/env.js';

const sequelize = new Sequelize(env.db.name, env.db.user, env.db.pass, {
  host: env.db.host,
  port: env.db.port,
  dialect: 'mysql',
  logging: false,
});

async function check() {
  const [nullBatches] = await sequelize.query(`
    SELECT t.id, t.transaction_type, t.product_id, t.warehouse_id
    FROM inventory_transactions t
    LEFT JOIN inventory_transaction_batches b ON t.id = b.inventory_transaction_id
    WHERE b.id IS NULL;
  `);
  console.log("Transactions without batches:", nullBatches.length);

  const [nullBatchIds] = await sequelize.query(`
    SELECT COUNT(*) as count FROM inventory_transaction_batches WHERE batch_id IS NULL;
  `);
  console.log("Transaction batches with null batch_id:", nullBatchIds[0].count);

  process.exit(0);
}
check();
