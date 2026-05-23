import { Sequelize } from 'sequelize';
import { env } from './src/config/env.js';

const sequelize = new Sequelize(env.db.name, env.db.user, env.db.pass, {
  host: env.db.host,
  port: env.db.port,
  dialect: 'mysql',
  logging: false,
});

async function check() {
  const [current] = await sequelize.query(`SELECT product_id, warehouse_id, quantity FROM current_inventory`);
  const [batches] = await sequelize.query(`
    SELECT b.product_id, bi.warehouse_id, SUM(bi.quantity) as batch_qty
    FROM batch_inventory bi
    JOIN batches b ON bi.batch_id = b.id
    GROUP BY b.product_id, bi.warehouse_id
  `);

  let differences = 0;
  for (const c of current) {
    const b = batches.find(x => x.product_id === c.product_id && x.warehouse_id === c.warehouse_id);
    const bQty = b ? parseFloat(b.batch_qty) : 0;
    const cQty = parseFloat(c.quantity);
    if (bQty !== cQty) {
      console.log(`Mismatch Product ${c.product_id} Warehouse ${c.warehouse_id}: Current=${cQty}, Batches=${bQty}`);
      differences++;
    }
  }
  console.log(`Total differences: ${differences}`);
  process.exit(0);
}

check();
