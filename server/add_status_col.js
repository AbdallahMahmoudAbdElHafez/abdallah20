import { sequelize } from './src/models/index.js';
(async () => {
  try {
    await sequelize.query("ALTER TABLE sales_returns ADD COLUMN status ENUM('approved', 'cancelled') NOT NULL DEFAULT 'approved';");
    console.log('Added status column to sales_returns');
  } catch (e) {
    if (e.message.includes('Duplicate column name')) {
      console.log('Column already exists');
    } else {
      console.error(e);
    }
  }
  process.exit(0);
})();
