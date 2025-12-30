
import mysql from 'mysql2/promise';

async function main() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'Abdallah20203040',
        database: 'nurivina'
    });

    try {
        const [rows] = await connection.execute('SELECT id, name, account_type, parent_account_id, opening_balance FROM accounts');

        // Find which accounts are parents
        const parentIds = new Set(rows.map(r => r.parent_account_id).filter(id => id !== null));

        const openingBalances = rows.filter(r => r.opening_balance != 0);

        console.log('AUDIT_START');
        console.log(JSON.stringify({
            accounts: openingBalances,
            parentIds: Array.from(parentIds)
        }, null, 2));
        console.log('AUDIT_END');

    } catch (err) {
        console.error(err);
    } finally {
        await connection.end();
    }
}

main();
