import { Sequelize } from 'sequelize';
import { env } from '../src/config/env.js';

const sequelize = new Sequelize(env.db.name, env.db.user, env.db.pass, {
  host: env.db.host,
  port: env.db.port,
  dialect: 'mysql',
  logging: false,
});

async function fixInventory() {
  const transaction = await sequelize.transaction();
  try {
    console.log("Clearing batch_inventory and current_inventory...");
    await sequelize.query('DELETE FROM batch_inventory', { transaction });
    await sequelize.query('DELETE FROM current_inventory', { transaction });

    console.log("Recalculating and inserting into batch_inventory...");
    await sequelize.query(`
      INSERT INTO batch_inventory (batch_id, warehouse_id, quantity)
      SELECT 
          b.batch_id, 
          t.warehouse_id, 
          SUM(CASE WHEN t.transaction_type = 'in' THEN b.quantity ELSE -b.quantity END) as quantity
      FROM inventory_transactions t
      JOIN inventory_transaction_batches b ON t.id = b.inventory_transaction_id
      WHERE b.batch_id IS NOT NULL
      GROUP BY b.batch_id, t.warehouse_id
      HAVING quantity > 0;
    `, { transaction });

    console.log("Recalculating and inserting into current_inventory...");
    await sequelize.query(`
      INSERT INTO current_inventory (product_id, warehouse_id, quantity)
      SELECT 
          t.product_id, 
          t.warehouse_id, 
          SUM(CASE WHEN t.transaction_type = 'in' THEN b.quantity ELSE -b.quantity END) as quantity
      FROM inventory_transactions t
      JOIN inventory_transaction_batches b ON t.id = b.inventory_transaction_id
      GROUP BY t.product_id, t.warehouse_id
      HAVING quantity >= 0;
    `, { transaction });

    await transaction.commit();
    console.log("Inventory synced successfully!");
  } catch (err) {
    await transaction.rollback();
    console.error("Error syncing inventory:", err);
  }
  process.exit(0);
}

fixInventory();
