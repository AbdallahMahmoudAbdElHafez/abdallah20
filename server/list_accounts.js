
import { sequelize, Account } from './src/models/index.js';

(async () => {
    try {
        await sequelize.authenticate();
        const accounts = await Account.findAll({
            attributes: ['id', 'name', 'code', 'account_type']
        });
        console.log("ACCOUNTS_LIST_START");
        console.log(JSON.stringify(accounts, null, 2));
        console.log("ACCOUNTS_LIST_END");
    } catch (error) {
        console.error("Error fetching accounts:", error);
    } finally {
        await sequelize.close();
    }
})();

