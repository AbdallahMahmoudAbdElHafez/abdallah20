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

        // Get valid ID
        const invoice = await sequelize.query("SELECT id FROM sales_invoices LIMIT 1", { type: sequelize.QueryTypes.SELECT });
        const warehouse = await sequelize.query("SELECT id FROM warehouses LIMIT 1", { type: sequelize.QueryTypes.SELECT });

        if (!invoice[0] || !warehouse[0]) {
            console.log('No invoice/warehouse found to test with.');
            return;
        }

        const invId = invoice[0].id;
        const whId = warehouse[0].id;

        console.log(`Testing Insert with InvID: ${invId}, WhID: ${whId}`);

        // Raw Insert
        await sequelize.query(`
            INSERT INTO sales_returns 
            (sales_invoice_id, warehouse_id, return_date, notes, return_type, created_at) 
            VALUES 
            (${invId}, ${whId}, CURDATE(), 'Test Return', 'cash', NOW())
        `);

        console.log('INSERT SUCCESSFUL!');

    } catch (e) {
        console.error('INSERT FAILED:', e.original ? e.original.message : e.message);
        console.error('Full Error:', e);
    } finally { await sequelize.close(); }
})();
