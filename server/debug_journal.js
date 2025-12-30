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
        // Get ALL recent journal entries (not just purchase)
        const [allJournals] = await connection.execute(`
            SELECT je.id, je.description, je.created_at
            FROM journal_entries je
            ORDER BY je.id DESC
            LIMIT 10
        `);

        // Get most recent journal entry lines
        const [recentLines] = await connection.execute(`
            SELECT je.id as entry_id, je.description, jel.account_id, a.name as account_name, jel.debit, jel.credit
            FROM journal_entries je
            JOIN journal_entry_lines jel ON je.id = jel.journal_entry_id
            JOIN accounts a ON jel.account_id = a.id
            ORDER BY je.id DESC
            LIMIT 30
        `);

        // Check for recent purchase invoices
        const [recentInvoices] = await connection.execute(`
            SELECT id, invoice_number, status, total_amount, subtotal, created_at
            FROM purchase_invoices
            ORDER BY id DESC
            LIMIT 5
        `);

        const result = {
            recentJournalEntries: allJournals,
            recentJournalLines: recentLines,
            recentInvoices
        };

        fs.writeFileSync('debug_journal.json', JSON.stringify(result, null, 2));
        console.log('Debug data saved to debug_journal.json');
        console.log('Recent journal entries:', allJournals.length);
        console.log('Recent lines:', recentLines.length);
        console.log('Recent invoices:', recentInvoices.length);
    } catch (err) {
        console.error(err);
    } finally {
        await connection.end();
    }
}

main();
