import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('nurivina', 'root', 'Abdallah20203040', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false
});

(async () => {
    try {
        await sequelize.authenticate();

        const triggers = await sequelize.query(`SHOW TRIGGERS LIKE 'sales_returns'`, { type: sequelize.QueryTypes.SELECT });

        console.log('--- FOUND TRIGGERS ---');
        for (const trg of triggers) {
            console.log(`\nTrigger: ${trg.Trigger}`);
            console.log('Statement:');
            console.log(trg.Statement); // This contains the body
            console.log('-----------------------------------');
        }

    } catch (e) { console.error(e); } finally { await sequelize.close(); }
})();
