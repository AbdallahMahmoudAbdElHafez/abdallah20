import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('nurivina', 'root', 'Abdallah20203040', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false
});

(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connected to nurivina.');

        const products = await sequelize.query(
            `SELECT id, name, cost_price, price FROM products LIMIT 10`,
            { type: sequelize.QueryTypes.SELECT }
        );

        console.log('--- PRODUCT COSTS ---');
        products.forEach(p => console.log(`ID: ${p.id} | Name: "${p.name}" | Cost: ${p.cost_price} | Price: ${p.price}`));

        const cogsAccount = await sequelize.query(
            `SELECT * FROM accounts WHERE name LIKE '%تكلفة%'`,
            { type: sequelize.QueryTypes.SELECT }
        );
        console.log('\n--- COGS ACCOUNT ---');
        cogsAccount.forEach(a => console.log(a));

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
})();
