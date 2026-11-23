import { sequelize } from '../src/models/index.js';

async function executeVatCancellation() {
    const t = await sequelize.transaction();
    try {
        console.log('=== STARTING VAT CANCELLATION EXECUTION ===');

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
            console.log('Using existing reference_type with ID:', refTypeId);
        }

        // 2. Fetch all 69 VAT credit lines from sales invoices
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

        console.log(`Processing ${vatLines.length} VAT lines...`);
        let totalReversed = 0;
        const createdEntries = [];

        for (const item of vatLines) {
            const amount = parseFloat(item.vat_amount);
            totalReversed += amount;
            const invNum = item.invoice_number || `ID-${item.invoice_id}`;

            // Create Journal Entry (Entry Type 10 = قيد تسوية)
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
            const [line1Res] = await sequelize.query(`
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
            const [line2Res] = await sequelize.query(`
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

            createdEntries.push({
                jeId: newJeId,
                invoiceNumber: invNum,
                date: item.entry_date,
                amount
            });
        }

        // Commit all changes
        await t.commit();
        console.log(`=== SUCCESSFULLY COMMITTED ${createdEntries.length} JOURNAL ENTRIES ===`);
        console.log(`Total VAT successfully transferred to Sales: ${totalReversed.toFixed(2)} EGP.`);

        // Final verification of Account 65
        const [acc65Check] = await sequelize.query(`
            SELECT 
                SUM(debit) as total_debit,
                SUM(credit) as total_credit,
                (SUM(credit) - SUM(debit)) as net_balance
            FROM journal_entry_lines
            WHERE account_id = 65
        `);
        console.log('Account 65 final balance:', acc65Check[0]);

        // Final verification of Account 28 (مبيعات)
        const [acc28Check] = await sequelize.query(`
            SELECT 
                SUM(debit) as total_debit,
                SUM(credit) as total_credit,
                (SUM(credit) - SUM(debit)) as net_balance
            FROM journal_entry_lines
            WHERE account_id = 28
        `);
        console.log('Account 28 (مبيعات) final balance:', acc28Check[0]);

        process.exit(0);
    } catch (err) {
        await t.rollback();
        console.error('CRITICAL ERROR - TRANSACTION ROLLED BACK:', err);
        process.exit(1);
    }
}

executeVatCancellation();
