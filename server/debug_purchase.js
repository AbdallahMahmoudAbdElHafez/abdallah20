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
        // Check products with their type_id
        const [products] = await connection.execute(`
            SELECT p.id, p.name, p.type_id, pt.name as type_name 
            FROM products p 
            LEFT JOIN product_types pt ON p.type_id = pt.id 
            LIMIT 15
        `);

        // Check recent purchase invoices with items
        const [invoices] = await connection.execute(`
            SELECT pi.id, pi.status, pi.total_amount,
                   pii.product_id, pii.total_price, pr.name as product_name, pr.type_id
            FROM purchase_invoices pi
            JOIN purchase_invoice_items pii ON pi.id = pii.purchase_invoice_id
            JOIN products pr ON pii.product_id = pr.id
            ORDER BY pi.id DESC
            LIMIT 20
        `);

        // Check recent journal entries
        const [journalEntries] = await connection.execute(`
            SELECT je.id, je.description, jel.account_id, a.name as account_name, jel.debit, jel.credit
            FROM journal_entries je
            JOIN journal_entry_lines jel ON je.id = jel.journal_entry_id
            JOIN accounts a ON jel.account_id = a.id
            WHERE je.description LIKE '%مشتريات%'
            ORDER BY je.id DESC
            LIMIT 20
        `);

        const result = {
            products,
            recentInvoicesWithItems: invoices,
            recentJournalEntries: journalEntries
        };

        fs.writeFileSync('debug_purchase.json', JSON.stringify(result, null, 2));
        console.log('Debug data saved to debug_purchase.json');
        console.log('Products with type_id:', products.length);
        console.log('Recent invoices with items:', invoices.length);
        console.log('Recent journal entries:', journalEntries.length);
    } catch (err) {
        console.error(err);
    } finally {
        await connection.end();
    }
}

main();
