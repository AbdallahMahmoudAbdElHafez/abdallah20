import { sequelize } from './src/models/index.js';

async function check() {
    try {
        const [columns] = await sequelize.query("SHOW COLUMNS FROM doctors");
        console.log(JSON.stringify(columns, null, 2));
    } catch (error) {
        console.error(error);
    } finally {
        await sequelize.close();
    }
}

check();
