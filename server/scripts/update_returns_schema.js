import { sequelize } from '../src/models/index.js';

async function updateSchema() {
    try {
        console.log('Adding columns to issue_voucher_returns...');
        await sequelize.query(`
      ALTER TABLE issue_voucher_returns 
      ADD COLUMN status VARCHAR(20) DEFAULT 'draft',
      ADD COLUMN employee_id INT NULL,
      ADD COLUMN approved_by INT NULL,
      ADD FOREIGN KEY (employee_id) REFERENCES employees(id),
      ADD FOREIGN KEY (approved_by) REFERENCES employees(id);
    `);
        console.log('Successfully updated issue_voucher_returns schema.');

        try {
            await sequelize.query(`ALTER TABLE issue_voucher_returns ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;`);
            console.log('Added updated_at to issue_voucher_returns');
        } catch (e) { console.log('updated_at might already exist on returns', e.message) }

        try {
            await sequelize.query(`ALTER TABLE issue_voucher_return_items ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;`);
            console.log('Added updated_at to issue_voucher_return_items');
        } catch (e) { console.log('updated_at might already exist on items', e.message) }

        try {
            await sequelize.query(`ALTER TABLE issue_voucher_return_items ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;`);
            console.log('Added created_at to issue_voucher_return_items');
        } catch (e) { console.log('created_at might already exist on items', e.message) }

        process.exit(0);
    } catch (error) {
        console.error('Error updating schema:', error);
        process.exit(1);
    }
}

updateSchema();
