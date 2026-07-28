import { sequelize } from './src/models/index.js';
(async () => {
  const res = await sequelize.query("SELECT id, reference_type_id, reference_id, description FROM journal_entries WHERE description LIKE '%عكس%' OR description LIKE '%للحذف%';");
  console.log(res[0]);
  process.exit(0);
})();
