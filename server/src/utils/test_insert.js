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

        // 1. Raw Insert Test
        console.log('Testing Raw Insert...');
        try {
            await sequelize.query(`
                INSERT INTO sales_returns 
                (sales_invoice_id, warehouse_id, return_date, notes, return_type, created_at) 
                VALUES 
                (1, 1, CURDATE(), 'Test Insert', 'cash', NOW())
            `);
            console.log('Insert SUCCESS!');
        } catch (err) {
            console.error('Insert FAILED:', err.original ? err.original.sqlMessage : err.message);
        }

        // 2. Simple Schema Dump
        console.log('\nChecking Columns:');
        const cols = await sequelize.query("SHOW COLUMNS FROM sales_returns", { type: sequelize.QueryTypes.SELECT });
        cols.forEach(c => console.log(`- ${c.Field}`));

        console.log('\nChecking Triggers:');
        const trigs = await sequelize.query("SHOW TRIGGERS LIKE 'sales_returns'", { type: sequelize.QueryTypes.SELECT });
        trigs.forEach(t => console.log(`- Trigger: ${t.Trigger}`));

    } catch (e) { console.error('Generic Error:', e); } finally { await sequelize.close(); }
})();
