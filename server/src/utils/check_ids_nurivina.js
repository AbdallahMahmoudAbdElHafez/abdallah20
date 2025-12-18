import { Sequelize } from 'sequelize';

// Checking 'nurivina' (User switched back to this)
const sequelize = new Sequelize('nurivina', 'root', 'Abdallah20203040', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false
});

(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connected to nurivina.');

        const accounts = await sequelize.query(
            `SELECT id, name FROM accounts WHERE id IN (65, 108)`,
            { type: sequelize.QueryTypes.SELECT }
        );

        console.log('--- ACCOUNT DETAILS ---');
        accounts.forEach(a => console.log(`ID: ${a.id} | Name: "${a.name}"`));

        // Also check if there are other accounts with similar names
        const vatAccounts = await sequelize.query(
            `SELECT id, name FROM accounts WHERE name LIKE '%ضريبة%'`,
            { type: sequelize.QueryTypes.SELECT }
        );
        console.log('\n--- VAT CANDIDATES ---');
        vatAccounts.forEach(a => console.log(`ID: ${a.id} | Name: "${a.name}"`));

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
})();
