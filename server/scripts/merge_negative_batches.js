import { Sequelize } from 'sequelize';
import { env } from '../src/config/env.js';

const sequelize = new Sequelize(env.db.name, env.db.user, env.db.pass, {
  host: env.db.host,
  port: env.db.port,
  dialect: 'mysql',
  logging: false,
});

async function mergeNegativeBatches() {
  const [batches] = await sequelize.query(`
    SELECT b.batch_id, t.warehouse_id, batches.product_id,
           SUM(CASE WHEN t.transaction_type = 'in' THEN b.quantity ELSE -b.quantity END) as quantity
    FROM inventory_transactions t
    JOIN inventory_transaction_batches b ON t.id = b.inventory_transaction_id
    JOIN batches ON b.batch_id = batches.id
    WHERE b.batch_id IS NOT NULL
    GROUP BY b.batch_id, t.warehouse_id, batches.product_id
  `);

  const negativeBatches = batches.filter(b => b.quantity < 0);
  const positiveBatches = batches.filter(b => b.quantity > 0);

  for (const neg of negativeBatches) {
    // Find a positive batch for the SAME product and warehouse
    const pos = positiveBatches.find(p => p.product_id === neg.product_id && p.warehouse_id === neg.warehouse_id);
    if (pos) {
      console.log(`Merging negative batch ${neg.batch_id} (qty ${neg.quantity}) into positive batch ${pos.batch_id} for product ${neg.product_id}`);
      await sequelize.query(`
        UPDATE inventory_transaction_batches b
        JOIN inventory_transactions t ON t.id = b.inventory_transaction_id
        SET b.batch_id = ?
        WHERE b.batch_id = ? AND t.warehouse_id = ?
      `, { replacements: [pos.batch_id, neg.batch_id, neg.warehouse_id] });
      
      // Update our in-memory positive batch quantity
      pos.quantity += parseFloat(neg.quantity);
    } else {
      console.log(`WARNING: Cannot find a positive batch to merge negative batch ${neg.batch_id} for product ${neg.product_id} warehouse ${neg.warehouse_id}`);
    }
  }

  console.log("Done merging negative batches!");
  process.exit(0);
}
mergeNegativeBatches();
