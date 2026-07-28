import { sequelize, ServicePayment } from './src/models/index.js';
(async () => {
    try {
        await sequelize.query("SET FOREIGN_KEY_CHECKS = 0;");
        await sequelize.query("ALTER TABLE external_service_invoices MODIFY COLUMN status ENUM('Draft', 'Posted', 'Partially Paid', 'Paid', 'Cancelled') DEFAULT 'Draft'");
        await sequelize.query("DROP TABLE IF EXISTS service_payments;");
        await ServicePayment.sync({ force: true });
        await sequelize.query("SET FOREIGN_KEY_CHECKS = 1;");
        console.log('Database schema updated successfully');
    } catch (e) {
        console.error(e);
    } finally {
        process.exit();
    }
})();
