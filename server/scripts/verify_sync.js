import { Sequelize } from 'sequelize';
import { env } from '../src/config/env.js';

const sequelize = new Sequelize(env.db.name, env.db.user, env.db.pass, {
  host: env.db.host,
  port: env.db.port,
  dialect: 'mysql',
  logging: false,
});

async function verify() {
  const [current] = await sequelize.query(`SELECT product_id, warehouse_id, quantity FROM current_inventory`);
  const [batches] = await sequelize.query(`
    SELECT b.product_id, bi.warehouse_id, SUM(bi.quantity) as batch_qty
    FROM batch_inventory bi
    JOIN batches b ON bi.batch_id = b.id
    GROUP BY b.product_id, bi.warehouse_id
  `);

  let mismatches = [];
  for (const c of current) {
    const b = batches.find(x => x.product_id === c.product_id && x.warehouse_id === c.warehouse_id);
    const bQty = b ? parseFloat(b.batch_qty) : 0;
    const cQty = parseFloat(c.quantity);
    if (bQty !== cQty) {
      mismatches.push({ product_id: c.product_id, warehouse_id: c.warehouse_id, currentQty: cQty, batchQty: bQty });
    }
  }

  console.log("Mismatches between current and batches:", mismatches);
  process.exit(0);
}
verify();
