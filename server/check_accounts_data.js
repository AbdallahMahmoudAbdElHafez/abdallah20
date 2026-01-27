import { Account } from './src/models/index.js';

async function checkAccounts() {
    try {
        const accounts = await Account.findAll({
            attributes: ['id', 'name', 'account_type', 'parent_account_id', 'normal_balance'],
            order: [['id', 'ASC']]
        });
        console.log(JSON.stringify(accounts, null, 2));
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

checkAccounts();
