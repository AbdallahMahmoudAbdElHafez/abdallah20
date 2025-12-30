
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
        const [rows] = await connection.execute('SELECT id, name, account_type, parent_account_id, opening_balance FROM accounts');

        const allParentIds = new Set(rows.map(r => r.parent_account_id).filter(id => id !== null));
        const openingBalances = rows.filter(r => r.opening_balance != 0);

        const data = {
            accounts: openingBalances,
            parentAccountIds: Array.from(allParentIds)
        };

        fs.writeFileSync('audit_data.json', JSON.stringify(data, null, 2));
        console.log('Data saved to audit_data.json');

    } catch (err) {
        console.error(err);
    } finally {
        await connection.end();
    }
}

main();
