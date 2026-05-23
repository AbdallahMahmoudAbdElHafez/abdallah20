import { Sequelize } from 'sequelize';
import { env } from '../src/config/env.js';

const sequelize = new Sequelize(env.db.name, env.db.user, env.db.pass, {
  host: env.db.host,
  port: env.db.port,
  dialect: 'mysql',
  logging: false,
});

async function check() {
  const [negBatches] = await sequelize.query(`
    SELECT * FROM inventory_transaction_batches WHERE quantity < 0 LIMIT 5;
  `);
  console.log("Negative quantities in transaction batches:", negBatches);

  const [negTrx] = await sequelize.query(`
    SELECT * FROM inventory_transactions WHERE quantity < 0 LIMIT 5;
  `);
  console.log("Negative quantities in transactions:", negTrx);

  process.exit(0);
}
check();
