
import mysql from 'mysql2/promise';
import fs from 'fs';

async function main() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'Abdallah20203040',
        database: 'nurivina'
    });

    try {
        const [rows] = await connection.execute('SELECT id, name, account_type, normal_balance, opening_balance FROM accounts WHERE opening_balance != 0');
        fs.writeFileSync('account_balances_check.json', JSON.stringify(rows, null, 2));
        console.log('Results saved to account_balances_check.json');
    } catch (err) {
        console.error(err);
    } finally {
        await connection.end();
    }
}

main();
