import { Sequelize } from 'sequelize';
import fs from 'fs';

const sequelize = new Sequelize('nurivina', 'root', 'Abdallah20203040', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false
});

(async () => {
    try {
        await sequelize.authenticate();
        const [results] = await sequelize.query("SHOW CREATE TRIGGER trg_after_insert_sales_return");
        const triggerSql = results[0]['SQL Original Statement'];
        fs.writeFileSync('d:/db/server/src/utils/trigger_definition.sql', triggerSql);
        console.log('Trigger definition saved to d:/db/server/src/utils/trigger_definition.sql');
    } catch (e) { console.error(e); } finally { await sequelize.close(); }
})();
