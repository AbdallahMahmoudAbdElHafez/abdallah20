import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('nurivina', 'root', 'Abdallah20203040', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false
});

(async () => {
    try {
        await sequelize.authenticate();
        const [results] = await sequelize.query("SHOW CREATE TRIGGER trg_after_insert_sales_return");
        console.log(results[0]['SQL Original Statement']);
    } catch (e) { console.error(e); } finally { await sequelize.close(); }
})();
