import mysql from 'mysql2/promise';

async function main() {
    const c = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'Abdallah20203040',
        database: 'nurivina_erp'
    });

    console.log('=== JOURNAL ENTRIES FOR JOB ORDER 6 (ALL RELATED) ===');
    const [entries] = await c.execute(`
        SELECT je.id as je_id, je.entry_date, je.description as je_desc, rt.code as ref_code, rt.label as ref_name
        FROM journal_entries je
        LEFT JOIN reference_types rt ON rt.id = je.reference_type_id
        WHERE je.reference_id = 6 
           OR je.description LIKE '%6%'
           OR je.id IN (3568, 3569)
        ORDER BY je.id
    `);
    console.log('Entries:', entries);

    for (const entry of entries) {
        const [lines] = await c.execute(`
            SELECT jel.*, a.code as acc_code, a.name as acc_name
            FROM journal_entry_lines jel
            LEFT JOIN accounts a ON a.id = jel.account_id
            WHERE jel.journal_entry_id = ?
        `, [entry.je_id]);
        console.log(`\n--- JE #${entry.je_id} (${entry.je_desc}) ---`);
        console.table(lines.map(l => ({
            acc_code: l.acc_code,
            acc_name: l.acc_name,
            debit: l.debit,
            credit: l.credit,
            desc: l.description
        })));
    }

    console.log('\n=== PARTY 74 (مصنع ECC) LEDGER ENTRIES ===');
    const [partyLines] = await c.execute(`
        SELECT jel.*, je.entry_date, je.description as je_desc, a.name as acc_name
        FROM journal_entry_lines jel
        JOIN journal_entries je ON je.id = jel.journal_entry_id
        JOIN accounts a ON a.id = jel.account_id
        WHERE jel.account_id = 62
        ORDER BY je.entry_date, je.id, jel.id
    `);
    console.table(partyLines.map(l => ({
        je_id: l.journal_entry_id,
        date: l.entry_date,
        je_desc: l.je_desc,
        debit: l.debit,
        credit: l.credit,
        line_desc: l.description
    })));

    await c.end();
}

main().catch(console.error);
