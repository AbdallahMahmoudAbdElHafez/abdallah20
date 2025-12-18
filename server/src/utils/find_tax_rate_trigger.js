import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('nurivina', 'root', 'Abdallah20203040', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false
});

(async () => {
    try {
        await sequelize.authenticate();
        // Search all trigger definitions for 'tax_rate'
        const triggers = await sequelize.query(`
            SELECT TRIGGER_NAME, EVENT_OBJECT_TABLE 
            FROM INFORMATION_SCHEMA.TRIGGERS 
            WHERE ACTION_STATEMENT LIKE '%tax_rate%' 
               OR TRIGGER_NAME LIKE '%tax_rate%'
        `, { type: sequelize.QueryTypes.SELECT });

        console.log('--- TRIGGERS WITH tax_rate ---');
        if (triggers.length > 0) {
            console.table(triggers);
        } else {
            console.log('No triggers found referencing tax_rate.');
        }

    } catch (e) { console.error(e); } finally { await sequelize.close(); }
})();
