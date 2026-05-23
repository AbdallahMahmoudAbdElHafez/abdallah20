import { Sequelize } from 'sequelize';
import { env } from '../src/config/env.js';

const sequelize = new Sequelize(env.db.name, env.db.user, env.db.pass, {
  host: env.db.host,
  port: env.db.port,
  dialect: 'mysql',
  logging: false,
});

async function checkProduct6() {
  const [batches] = await sequelize.query(`
    SELECT b.id, b.batch_number, bi.quantity
    FROM batches b
    JOIN batch_inventory bi ON b.id = bi.batch_id
    WHERE b.product_id = 6 AND bi.warehouse_id = 10
  `);
  console.log("Batches for Product 6 Warehouse 10:", batches);

  process.exit(0);
}
checkProduct6();
