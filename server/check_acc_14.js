
import mysql from 'mysql2/promise';

async function main() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'Abdallah20203040',
        database: 'nurivina'
    });

    try {
        const [rows] = await connection.execute('SELECT id, name FROM accounts WHERE id = 14');
        console.log('ACCOUNT_14:', JSON.stringify(rows[0]));
    } catch (err) {
        console.error(err);
    } finally {
        await connection.end();
    }
}

main();
