import mysql from 'mysql2/promise';

async function main() {
    const c = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'Abdallah20203040',
        database: 'nurivina_erp'
    });

    const [entries] = await c.execute(`
        SELECT je.id as je_id, je.entry_date, je.description as je_desc, rt.code as ref_code, rt.label as ref_name
        FROM journal_entries je
        LEFT JOIN reference_types rt ON rt.id = je.reference_type_id
        WHERE (je.reference_id = 6 AND rt.code LIKE '%job_order%')
           OR je.id IN (3568, 3569)
        ORDER BY je.id
    `);

    for (const entry of entries) {
        const [lines] = await c.execute(`
            SELECT jel.id, jel.account_id, a.name as acc_name, jel.debit, jel.credit, jel.description
            FROM journal_entry_lines jel
            LEFT JOIN accounts a ON a.id = jel.account_id
            WHERE jel.journal_entry_id = ?
        `, [entry.je_id]);
        console.log(`\n======================================================`);
        console.log(`JE #${entry.je_id} | Date: ${entry.entry_date} | Ref: ${entry.ref_code}`);
        console.log(`Desc: ${entry.je_desc}`);
        console.log(`------------------------------------------------------`);
        console.table(lines.map(l => ({
            account: `${l.account_id} - ${l.acc_name}`,
            debit: Number(l.debit).toFixed(2),
            credit: Number(l.credit).toFixed(2),
            desc: l.description
        })));
    }

    console.log('\n======================================================');
    console.log('ECC FACTORY ACCOUNT (62 - مصنع ECC) ALL LINES IN 2026-09:');
    console.log('------------------------------------------------------');
    const [eccLines] = await c.execute(`
        SELECT jel.journal_entry_id, je.entry_date, je.description as je_desc, jel.debit, jel.credit, jel.description as line_desc
        FROM journal_entry_lines jel
        JOIN journal_entries je ON je.id = jel.journal_entry_id
        WHERE jel.account_id = 62
        ORDER BY je.entry_date, je.id
    `);
    console.table(eccLines.map(l => ({
        je: l.journal_entry_id,
        date: l.entry_date,
        debit: Number(l.debit).toFixed(2),
        credit: Number(l.credit).toFixed(2),
        desc: l.line_desc
    })));

    await c.end();
}

main().catch(console.error);
