import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('nurivina', 'root', 'Abdallah20203040', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false
});

(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connected.');

        // 1. Columns
        console.log('\n--- COLUMNS of sales_returns ---');
        const columns = await sequelize.query(
            "SELECT COLUMN_NAME, COLUMN_TYPE, EXTRA FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'sales_returns' AND TABLE_SCHEMA = 'nurivina'",
            { type: sequelize.QueryTypes.SELECT }
        );
        console.table(columns);

        // 2. Triggers (Deep search)
        console.log('\n--- TRIGGERS on sales_returns ---');
        const triggers = await sequelize.query(
            "SELECT TRIGGER_NAME, ACTION_TIMING, EVENT_MANIPULATION, ACTION_STATEMENT FROM INFORMATION_SCHEMA.TRIGGERS WHERE EVENT_OBJECT_TABLE = 'sales_returns' AND TRIGGER_SCHEMA = 'nurivina'",
            { type: sequelize.QueryTypes.SELECT }
        );

        if (triggers.length === 0) {
            console.log('No triggers found.');
        } else {
            triggers.forEach(t => {
                console.log(`\nTrigger: ${t.TRIGGER_NAME} (${t.ACTION_TIMING} ${t.EVENT_MANIPULATION})`);
                console.log('Body:', t.ACTION_STATEMENT);
            });
        }

        // 3. Search for tax_rate in ALL triggers
        console.log('\n--- ALL TRIGGERS referencing tax_rate ---');
        const allTriggers = await sequelize.query(
            "SELECT TRIGGER_NAME, EVENT_OBJECT_TABLE FROM INFORMATION_SCHEMA.TRIGGERS WHERE ACTION_STATEMENT LIKE '%tax_rate%' AND TRIGGER_SCHEMA = 'nurivina'",
            { type: sequelize.QueryTypes.SELECT }
        );
        console.table(allTriggers);


    } catch (e) { console.error(e); } finally { await sequelize.close(); }
})();
