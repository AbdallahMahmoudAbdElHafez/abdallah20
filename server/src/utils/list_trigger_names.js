import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('nurivina', 'root', 'Abdallah20203040', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false
});

(async () => {
    try {
        await sequelize.authenticate();
        const triggers = await sequelize.query(`SHOW TRIGGERS LIKE 'sales_returns'`, { type: sequelize.QueryTypes.SELECT });
        console.log(JSON.stringify(triggers.map(t => t.Trigger)));
    } catch (e) { console.error(e); } finally { await sequelize.close(); }
})();
