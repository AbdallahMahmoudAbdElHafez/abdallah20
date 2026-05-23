import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('nurivina_erp', 'root', 'Abdallah20203040', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false
});

async function run() {
    try {
        await sequelize.query(`
            ALTER TABLE sales_invoices
            ADD COLUMN sales_channel ENUM('توزيع محلي', 'سوشيال ميديا', 'أخرى') DEFAULT 'توزيع محلي' AFTER shipping_by;
        `);
        console.log("Column added successfully!");
    } catch (error) {
        if (error.message.includes('Duplicate column name')) {
            console.log("Column already exists.");
        } else {
            console.error("Error adding column:", error);
        }
    } finally {
        await sequelize.close();
    }
}
run();
