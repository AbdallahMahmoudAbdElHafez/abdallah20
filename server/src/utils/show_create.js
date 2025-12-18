import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('nurivina', 'root', 'Abdallah20203040', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false
});

(async () => {
    try {
        await sequelize.authenticate();
        // Print Create Statement
        const result = await sequelize.query(`SHOW CREATE TABLE sales_returns`, { type: sequelize.QueryTypes.SELECT });
        console.log('--- SHOW CREATE TABLE ---');
        console.log(result[0]['Create Table']);

    } catch (e) { console.error(e); } finally { await sequelize.close(); }
})();
