import { Sequelize } from 'sequelize';
import { env } from '../src/config/env.js';

const sequelize = new Sequelize(env.db.name, env.db.user, env.db.pass, {
  host: env.db.host,
  port: env.db.port,
  dialect: 'mysql',
  logging: false,
});

async function debug() {
  const [batches] = await sequelize.query(`
    SELECT * FROM batch_inventory
    LIMIT 10;
  `);
  console.log("Batches:", batches);
  process.exit(0);
}
debug();
