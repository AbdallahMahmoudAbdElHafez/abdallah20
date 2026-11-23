import { sequelize } from '../src/models/index.js';

async function dryRunVatCancellation() {
    const t = await sequelize.transaction();
    try {
        // 1. Ensure reference type exists
        let [refType] = await sequelize.query(
            "SELECT * FROM reference_types WHERE code = 'sales_vat_cancellation'",
            { transaction: t }
        );
        let refTypeId;
        if (!refType || refType.length === 0) {
            const [insertRes] = await sequelize.query(`
                INSERT INTO reference_types (code, label, description, created_at, updated_at)
                VALUES ('sales_vat_cancellation', 'إلغاء ضريبة مبيعات', 'تسوية إلغاء ضريبة القيمة المضافة وتحميلها على المبيعات', NOW(), NOW())
            `, { transaction: t });
            refTypeId = insertRes;
            console.log('Created reference_type sales_vat_cancellation with ID:', refTypeId);
        } else {
            refTypeId = refType[0].id;
            console.log('Found existing reference_type with ID:', refTypeId);
        }

        // 2. Fetch all 69 lines
        const [vatLines] = await sequelize.query(`
            SELECT 
                jel.id as original_line_id,
                jel.journal_entry_id as original_je_id,
                jel.credit as vat_amount,
                je.entry_date,
                je.reference_id as invoice_id,
                si.invoice_number
            FROM journal_entry_lines jel
            JOIN journal_entries je ON je.id = jel.journal_entry_id
            LEFT JOIN sales_invoices si ON si.id = je.reference_id
            WHERE jel.account_id = 65 AND jel.credit > 0
            ORDER BY je.entry_date ASC, jel.id ASC
        `, { transaction: t });

        console.log(`Fetched ${vatLines.length} VAT lines to reverse.`);
        let totalReversed = 0;

        for (const item of vatLines) {
            const amount = parseFloat(item.vat_amount);
            totalReversed += amount;
            const invNum = item.invoice_number || `ID-${item.invoice_id}`;

            // Create Journal Entry
            const [jeResult] = await sequelize.query(`
                INSERT INTO journal_entries (entry_date, description, reference_type_id, reference_id, entry_type_id, created_at, updated_at)
                VALUES (:entryDate, :description, :refTypeId, :refId, 10, NOW(), NOW())
            `, {
                replacements: {
                    entryDate: item.entry_date,
                    description: `تسوية إلغاء ضريبة القيمة المضافة - فاتورة #${invNum}`,
                    refTypeId: refTypeId,
                    refId: item.invoice_id
                },
                transaction: t
            });
            const newJeId = jeResult;

            // Line 1: Debit Account 65 (ضريبة القيمة المضافة)
            await sequelize.query(`
                INSERT INTO journal_entry_lines (journal_entry_id, account_id, debit, credit, description, created_at, updated_at)
                VALUES (:jeId, 65, :debit, 0, :desc, NOW(), NOW())
            `, {
                replacements: {
                    jeId: newJeId,
                    debit: amount,
                    desc: `إلغاء ضريبة القيمة المضافة - فاتوره [${invNum}]`
                },
                transaction: t
            });

            // Line 2: Credit Account 28 (مبيعات)
            await sequelize.query(`
                INSERT INTO journal_entry_lines (journal_entry_id, account_id, debit, credit, description, created_at, updated_at)
                VALUES (:jeId, 28, 0, :credit, :desc, NOW(), NOW())
            `, {
                replacements: {
                    jeId: newJeId,
                    credit: amount,
                    desc: `رد قيمة الضريبة الملغاة إلى إيراد المبيعات - فاتوره [${invNum}]`
                },
                transaction: t
            });
        }

        console.log(`Successfully simulated creating ${vatLines.length} journal entries.`);
        console.log(`Total VAT transferred to Sales: ${totalReversed.toFixed(2)} EGP.`);

        // Check simulated balance of Account 65
        const [acc65Check] = await sequelize.query(`
            SELECT 
                SUM(debit) as total_debit,
                SUM(credit) as total_credit,
                (SUM(credit) - SUM(debit)) as net_balance
            FROM journal_entry_lines
            WHERE account_id = 65
        `, { transaction: t });
        console.log('Account 65 (ضريبة القيمة المضافة) new simulated balance:', acc65Check);

        // Check simulated balance of Account 28 (مبيعات)
        const [acc28Check] = await sequelize.query(`
            SELECT 
                SUM(debit) as total_debit,
                SUM(credit) as total_credit,
                (SUM(credit) - SUM(debit)) as net_balance
            FROM journal_entry_lines
            WHERE account_id = 28
        `, { transaction: t });
        console.log('Account 28 (مبيعات) new simulated balance:', acc28Check);

        // Rollback dry run!
        await t.rollback();
        console.log('DRY RUN COMPLETED AND ROLLED BACK SAFELY.');
        process.exit(0);
    } catch (err) {
        await t.rollback();
        console.error('Error in dry run:', err);
        process.exit(1);
    }
}

dryRunVatCancellation();
