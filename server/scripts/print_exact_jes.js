import mysql from 'mysql2/promise';

async function main() {
    const c = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'Abdallah20203040',
        database: 'nurivina_erp'
    });

    const jeIds = [3567, 3568, 3569, 3570];
    for (const id of jeIds) {
        const [je] = await c.execute(`SELECT * FROM journal_entries WHERE id = ?`, [id]);
        const [lines] = await c.execute(`
            SELECT jel.*, a.name as acc_name 
            FROM journal_entry_lines jel 
            LEFT JOIN accounts a ON a.id = jel.account_id 
            WHERE jel.journal_entry_id = ?
        `, [id]);
        console.log(`\n=== JE #${id} ===`);
        console.log('Header:', je[0]);
        console.table(lines.map(l => ({
            acc_id: l.account_id,
            acc_name: l.acc_name,
            debit: l.debit,
            credit: l.credit,
            desc: l.description
        })));
    }

    await c.end();
}

main().catch(console.error);
