
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
        const [types] = await connection.execute('SELECT id, name FROM product_types');
        const [accounts] = await connection.execute("SELECT id, name FROM accounts WHERE name LIKE '%مخزون%'");

        fs.writeFileSync('inventory_data.json', JSON.stringify({ productTypes: types, inventoryAccounts: accounts }, null, 2));
        console.log('Data saved to inventory_data.json');
    } catch (err) {
        console.error(err);
    } finally {
        await connection.end();
    }
}

main();
