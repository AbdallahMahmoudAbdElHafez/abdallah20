import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('nurivina', 'root', 'Abdallah20203040', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false
});

(async () => {
    try {
        await sequelize.authenticate();
        const triggers = await sequelize.query("SELECT TRIGGER_NAME, ACTION_STATEMENT FROM INFORMATION_SCHEMA.TRIGGERS WHERE EVENT_OBJECT_TABLE = 'sales_returns'", { type: sequelize.QueryTypes.SELECT });
        console.log(JSON.stringify(triggers, null, 2));
    } catch (e) { console.error(e); } finally { await sequelize.close(); }
})();
