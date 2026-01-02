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

        console.log('\nChecking Columns of sales_invoices:');
        const cols = await sequelize.query("SHOW COLUMNS FROM sales_invoices", { type: sequelize.QueryTypes.SELECT });
        cols.forEach(c => console.log(`- ${c.Field}`));

    } catch (e) { console.error('Generic Error:', e); } finally { await sequelize.close(); }
})();
