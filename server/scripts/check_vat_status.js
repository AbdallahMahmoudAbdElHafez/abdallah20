import { sequelize } from '../src/models/index.js';

async function checkStatus() {
    try {
        const [jes] = await sequelize.query(`
            SELECT id, entry_date, description, reference_type_id, reference_id, created_at
            FROM journal_entries 
            WHERE description LIKE '%إلغاء ضريبة%'
            ORDER BY id ASC
        `);
        console.log(`Matching journal entries with 'إلغاء ضريبة': ${jes.length}`);
        if (jes.length > 0) {
            console.log('Sample first 3:', jes.slice(0, 3));
            console.log('Sample last 3:', jes.slice(-3));

            const [lines] = await sequelize.query(`
                SELECT jel.id, jel.journal_entry_id, jel.account_id, jel.debit, jel.credit, jel.description
                FROM journal_entry_lines jel
                WHERE jel.journal_entry_id IN (${jes.slice(0, 2).map(j => j.id).join(',')})
            `);
            console.log('Sample lines:', lines);
        }

        const [acc65] = await sequelize.query(`
            SELECT 
                COUNT(*) as count,
                SUM(debit) as debit,
                SUM(credit) as credit,
                (SUM(credit) - SUM(debit)) as net_balance
            FROM journal_entry_lines
            WHERE account_id = 65
        `);
        console.log('Account 65 status:', acc65[0]);

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
checkStatus();
