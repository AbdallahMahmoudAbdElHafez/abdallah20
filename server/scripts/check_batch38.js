import mysql from 'mysql2/promise';

async function main() {
    const c = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'Abdallah20203040',
        database: 'nurivina_erp'
    });

    try {
        const [rows] = await c.execute(`SELECT * FROM product_costs WHERE product_id = 2`);
        console.log('product_costs for product 2:', rows);
    } catch(e) {
        console.log('product_costs table error:', e.message);
    }

    try {
        const [itb] = await c.execute(`SELECT * FROM inventory_transaction_batches WHERE inventory_transaction_id = 3497`);
        console.log('itb for 3497:', itb);
    } catch(e) {
        console.log('itb error:', e.message);
    }

    try {
        const [batches] = await c.execute(`SELECT * FROM batches WHERE id = 38`);
        console.log('batch 38:', batches);
    } catch(e) {
        console.log('batch error:', e.message);
    }

    await c.end();
}

main().catch(console.error);
