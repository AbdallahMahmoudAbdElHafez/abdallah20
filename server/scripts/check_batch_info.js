import { Sequelize } from 'sequelize';
import { env } from '../src/config/env.js';

const sequelize = new Sequelize(env.db.name, env.db.user, env.db.pass, {
  host: env.db.host,
  port: env.db.port,
  dialect: 'mysql',
  logging: false,
});

async function checkBatchInfo() {
  const [batchInfo] = await sequelize.query(`
    SELECT * FROM batches WHERE id = 2
  `);
  console.log("Batch 2 Info:", batchInfo[0]);

  const [current] = await sequelize.query(`
    SELECT * FROM current_inventory WHERE product_id = ? AND warehouse_id = 10
  `, { replacements: [batchInfo[0].product_id] });
  console.log("Current Inventory for product:", current[0]);

  process.exit(0);
}
checkBatchInfo();
