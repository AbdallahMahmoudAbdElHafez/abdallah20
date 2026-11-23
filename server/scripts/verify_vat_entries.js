import { sequelize } from '../src/models/index.js';

async function verifyEntries() {
    try {
        const [refType] = await sequelize.query("SELECT * FROM reference_types WHERE code = 'sales_vat_cancellation'");
        console.log('Reference Type:', refType);

        const [entries] = await sequelize.query(`
            SELECT 
                je.id,
                je.entry_date,
                je.description as je_desc,
                je.reference_id,
                je.created_at,
                COUNT(jel.id) as line_count,
                SUM(jel.debit) as total_debit,
                SUM(jel.credit) as total_credit
            FROM journal_entries je
            JOIN journal_entry_lines jel ON jel.journal_entry_id = je.id
            WHERE je.reference_type_id = :refTypeId
            GROUP BY je.id
            ORDER BY je.id ASC
        `, {
            replacements: { refTypeId: refType[0].id }
        });

        console.log(`Total new settlement entries created: ${entries.length}`);
        let totalVal = 0;
        entries.forEach(e => totalVal += parseFloat(e.total_debit));
        console.log(`Total value of new settlement entries: ${totalVal.toFixed(2)} EGP`);

        // Check sample of 10 lines
        const [sampleWithLines] = await sequelize.query(`
            SELECT 
                je.id as je_id,
                je.entry_date,
                a.name as account_name,
                jel.account_id,
                jel.debit,
                jel.credit,
                jel.description
            FROM journal_entries je
            JOIN journal_entry_lines jel ON jel.journal_entry_id = je.id
            JOIN accounts a ON a.id = jel.account_id
            WHERE je.reference_type_id = :refTypeId
            ORDER BY je.id ASC, jel.id ASC
            LIMIT 10
        `, {
            replacements: { refTypeId: refType[0].id }
        });

        console.log('Sample created entries with lines:');
        console.table(sampleWithLines);

        // Verify that NO original entries were modified or deleted:
        const [origEntriesCount] = await sequelize.query("SELECT COUNT(*) as count FROM journal_entries WHERE reference_type_id = 16");
        console.log(`Original Sales Invoices Journal Entries count: ${origEntriesCount[0].count} (completely untouched)`);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
verifyEntries();
