import mysql from 'mysql2/promise';

async function main() {
    const c = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'Abdallah20203040',
        database: 'nurivina_erp'
    });

    console.log('>>> Starting transaction to fix Job Order #6 and Serum cost...');
    await c.beginTransaction();

    try {
        // 1. Update external_job_orders for order 6
        const [updateJob] = await c.execute(`
            UPDATE external_job_orders
            SET actual_processing_cost_per_unit = 107.60,
                actual_raw_material_cost_per_unit = 23.01,
                total_actual_cost = 335668.00
            WHERE id = 6
        `);
        console.log(`1. Updated external_job_orders #6: affected ${updateJob.affectedRows} rows`);

        // 2. Update products cost_price for product 2 (Serum)
        const [updateProduct] = await c.execute(`
            UPDATE products
            SET cost_price = 130.61
            WHERE id = 2
        `);
        console.log(`2. Updated products #2 cost_price to 130.61: affected ${updateProduct.affectedRows} rows`);

        // 3. Update inventory_transaction_batches for transaction 3497 (Batch 38)
        const [updateItb] = await c.execute(`
            UPDATE inventory_transaction_batches
            SET cost_per_unit = 130.61
            WHERE inventory_transaction_id = 3497 AND batch_id = 38
        `);
        console.log(`3. Updated inventory_transaction_batches for transaction 3497: affected ${updateItb.affectedRows} rows`);

        // 4. Update Journal Entry 3570
        // A. Set finished goods (account 110) debit to 335,668.00
        const [updateJel110] = await c.execute(`
            UPDATE journal_entry_lines
            SET debit = 335668.00
            WHERE journal_entry_id = 3570 AND account_id = 110
        `);
        console.log(`4A. Updated JE 3570 account 110 debit to 335668.00: affected ${updateJel110.affectedRows} rows`);

        // B. Delete the supplier deduction line (account 62)
        const [deleteJel62] = await c.execute(`
            DELETE FROM journal_entry_lines
            WHERE journal_entry_id = 3570 AND account_id = 62
        `);
        console.log(`4B. Deleted JE 3570 account 62 deduction line: affected ${deleteJel62.affectedRows} rows`);

        await c.commit();
        console.log('>>> Transaction successfully committed!');

        // Verification check
        console.log('\n=== VERIFICATION ===');
        const [job] = await c.execute(`SELECT id, order_quantity, produced_quantity, waste_quantity, actual_processing_cost_per_unit, actual_raw_material_cost_per_unit, total_actual_cost FROM external_job_orders WHERE id = 6`);
        console.log('Job Order 6:', job[0]);

        const [prod] = await c.execute(`SELECT id, name, cost_price FROM products WHERE id = 2`);
        console.log('Product 2:', prod[0]);

        const [itb] = await c.execute(`SELECT * FROM inventory_transaction_batches WHERE inventory_transaction_id = 3497`);
        console.log('Batch In Trx:', itb[0]);

        const [jeLines] = await c.execute(`
            SELECT jel.account_id, a.name as acc_name, jel.debit, jel.credit, jel.description
            FROM journal_entry_lines jel
            LEFT JOIN accounts a ON a.id = jel.account_id
            WHERE jel.journal_entry_id = 3570
        `);
        console.log('JE 3570 Lines:');
        console.table(jeLines.map(l => ({
            account: `${l.account_id} - ${l.acc_name}`,
            debit: Number(l.debit).toFixed(2),
            credit: Number(l.credit).toFixed(2),
            desc: l.description
        })));

    } catch (err) {
        await c.rollback();
        console.error('>>> Error occurred, transaction rolled back:', err);
    } finally {
        await c.end();
    }
}

main().catch(console.error);
