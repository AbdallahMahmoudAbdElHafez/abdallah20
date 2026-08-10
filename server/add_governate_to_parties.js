import { sequelize } from './src/models/index.js';

async function updateSchema() {
    try {
        console.log("Updating schema...");
        await sequelize.query(`
            ALTER TABLE parties 
            ADD COLUMN governate_id INT NULL;
        `);
        console.log("Schema updated successfully.");
    } catch (error) {
        console.error("Error updating schema:", error);
    } finally {
        await sequelize.close();
    }
}

updateSchema();
