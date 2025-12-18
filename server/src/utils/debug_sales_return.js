import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('nurivina', 'root', 'Abdallah20203040', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false
});

(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connected to DB.');

        console.log('\n--- DESCRIBE sales_returns ---');
        const schema = await sequelize.query(`DESCRIBE sales_returns`, { type: sequelize.QueryTypes.SELECT });
        console.table(schema);

        console.log('\n--- TRIGGERS on sales_returns ---');
        const triggers = await sequelize.query(`SHOW TRIGGERS LIKE 'sales_returns'`, { type: sequelize.QueryTypes.SELECT });
        console.log(triggers);

        console.log('\n--- DESCRIBE sales_return_items (Just in case) ---');
        const itemsSchema = await sequelize.query(`DESCRIBE sales_return_items`, { type: sequelize.QueryTypes.SELECT });
        console.table(itemsSchema);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
})();
