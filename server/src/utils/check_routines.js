import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('nurivina', 'root', 'Abdallah20203040', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false
});

(async () => {
    try {
        await sequelize.authenticate();

        console.log('Testing SELECT * ...');
        try {
            await sequelize.query("SELECT * FROM sales_returns LIMIT 1");
            console.log('SELECT OK');
        } catch (e) {
            console.error('SELECT FAILED:', e.original ? e.original.message : e.message);
        }

        console.log('Searching RODUTINES ...');
        const routines = await sequelize.query(`
            SELECT ROUTINE_NAME, ROUTINE_DEFINITION 
            FROM INFORMATION_SCHEMA.ROUTINES 
            WHERE ROUTINE_DEFINITION LIKE '%tax_rate%'
        `, { type: sequelize.QueryTypes.SELECT });

        if (routines.length > 0) {
            console.table(routines);
        } else {
            console.log('No routines found with tax_rate.');
        }

    } catch (e) { console.error(e); } finally { await sequelize.close(); }
})();
