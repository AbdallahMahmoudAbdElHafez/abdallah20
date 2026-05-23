import { Sequelize } from 'sequelize';
import { env } from '../src/config/env.js';

const sequelize = new Sequelize(env.db.name, env.db.user, env.db.pass, {
  host: env.db.host,
  port: env.db.port,
  dialect: 'mysql',
  logging: false,
});

async function checkBatch() {
  const [transactions] = await sequelize.query(`
    SELECT t.id as trx_id, t.transaction_type, b.quantity as batch_qty, t.transaction_date, t.source_type, t.source_id
    FROM inventory_transactions t
    JOIN inventory_transaction_batches b ON t.id = b.inventory_transaction_id
    WHERE b.batch_id = 2 AND t.warehouse_id = 10
    ORDER BY t.transaction_date ASC, t.id ASC
  `);

  console.log("Transactions for batch_id 2, warehouse 10:");
  let runningTotal = 0;
  for (const trx of transactions) {
    if (trx.transaction_type === 'in') {
      runningTotal += parseFloat(trx.batch_qty);
    } else {
      runningTotal -= parseFloat(trx.batch_qty);
    }
    console.log(`[${trx.transaction_type.toUpperCase()}] Qty: ${trx.batch_qty} | Running Total: ${runningTotal} | Date: ${trx.transaction_date} | Source: ${trx.source_type} (ID: ${trx.source_id})`);
  }
  console.log("Final Actual Balance:", runningTotal);

  const [batchInventory] = await sequelize.query(`
    SELECT quantity FROM batch_inventory WHERE batch_id = 2 AND warehouse_id = 10
  `);
  console.log("Batch Inventory Table says:", batchInventory[0]?.quantity);

  process.exit(0);
}
checkBatch();
