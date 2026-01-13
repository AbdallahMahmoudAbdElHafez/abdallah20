import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('nurivina_erp', 'root', 'Abdallah20203040', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false
});

(async () => {
    try {
        await sequelize.authenticate();
        await sequelize.query("DROP TRIGGER IF EXISTS trg_after_insert_sales_return");
        console.log('Trigger trg_after_insert_sales_return dropped successfully.');

        // Also check purchase return trigger just in case
        await sequelize.query("DROP TRIGGER IF EXISTS trg_after_update_purchase_return");
        console.log('Trigger trg_after_update_purchase_return dropped successfully.');

    } catch (e) { console.error(e); } finally { await sequelize.close(); }
})();
