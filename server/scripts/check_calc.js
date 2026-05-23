import { Sequelize } from 'sequelize';
import { env } from '../src/config/env.js';

const sequelize = new Sequelize(env.db.name, env.db.user, env.db.pass, {
  host: env.db.host,
  port: env.db.port,
  dialect: 'mysql',
  logging: false,
});

async function check() {
  const [transactions] = await sequelize.query(`
    SELECT t.product_id, t.warehouse_id, 
           SUM(CASE WHEN t.transaction_type = 'in' THEN b.quantity ELSE -b.quantity END) as calc_qty
    FROM inventory_transactions t
    JOIN inventory_transaction_batches b ON t.id = b.inventory_transaction_id
    GROUP BY t.product_id, t.warehouse_id
  `);

  const [current] = await sequelize.query(`SELECT product_id, warehouse_id, quantity FROM current_inventory`);

  let differences = 0;
  for (const c of current) {
    const t = transactions.find(x => x.product_id === c.product_id && x.warehouse_id === c.warehouse_id);
    const tQty = t ? parseFloat(t.calc_qty) : 0;
    const cQty = parseFloat(c.quantity);
    if (tQty !== cQty) {
      console.log(`Mismatch Product ${c.product_id} Warehouse ${c.warehouse_id}: Current=${cQty}, Calculated=${tQty}`);
      differences++;
    }
  }
  console.log(`Total differences from transactions to current_inventory: ${differences}`);
  process.exit(0);
}

check();
