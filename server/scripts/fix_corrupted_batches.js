import { Sequelize } from 'sequelize';
import { env } from '../src/config/env.js';

const sequelize = new Sequelize(env.db.name, env.db.user, env.db.pass, {
  host: env.db.host,
  port: env.db.port,
  dialect: 'mysql',
  logging: false,
});

async function fixBatches() {
  const [rows] = await sequelize.query(`
    SELECT b.id as itb_id, t.id as trx_id, t.product_id as t_product, b.batch_id, batches.batch_number, batches.expiry_date
    FROM inventory_transactions t
    JOIN inventory_transaction_batches b ON t.id = b.inventory_transaction_id
    LEFT JOIN batches ON b.batch_id = batches.id
    WHERE t.product_id != batches.product_id OR batches.id IS NULL
  `);

  for (const row of rows) {
    if (row.batch_id) {
      // Find or create a batch for the CORRECT product_id with the SAME batch_number and expiry_date
      let [[correctBatch]] = await sequelize.query(
        `SELECT id FROM batches WHERE product_id = ? AND (batch_number = ? OR (batch_number IS NULL AND ? IS NULL)) LIMIT 1`,
        { replacements: [row.t_product, row.batch_number, row.batch_number] }
      );

      if (!correctBatch) {
        // Create it
        const [result] = await sequelize.query(
          `INSERT INTO batches (product_id, batch_number, expiry_date) VALUES (?, ?, ?)`,
          { replacements: [row.t_product, row.batch_number, row.expiry_date] }
        );
        correctBatch = { id: result };
      }

      // Update the inventory_transaction_batches to point to the correct batch
      await sequelize.query(
        `UPDATE inventory_transaction_batches SET batch_id = ? WHERE id = ?`,
        { replacements: [correctBatch.id, row.itb_id] }
      );
      console.log(`Fixed ITB ${row.itb_id}: Changed batch_id from ${row.batch_id} to ${correctBatch.id}`);
    }
  }

  console.log("Done fixing corrupted batches!");
  process.exit(0);
}
fixBatches();
