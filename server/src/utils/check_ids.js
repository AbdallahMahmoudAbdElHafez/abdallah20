import { Sequelize } from 'sequelize';

// Using the NEW db name 'nurivina_erp'
const sequelize = new Sequelize('nurivina_erp', 'root', 'Abdallah20203040', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false
});

(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connected to nurivina_erp.');

        const accounts = await sequelize.query(
            `SELECT id, name FROM accounts WHERE id IN (65, 108)`,
            { type: sequelize.QueryTypes.SELECT }
        );

        console.log('--- ACCOUNT DETAILS ---');
        accounts.forEach(a => console.log(`ID: ${a.id} | Name: "${a.name}"`));

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
})();
