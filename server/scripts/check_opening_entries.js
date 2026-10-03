import { sequelize } from '../src/models/index.js';

async function checkOpeningEntries() {
  console.log('==================================================');
  console.log('1. فحص توازن القيود الافتتاحية المسجلة (Opening Journal Entries)');
  console.log('==================================================');
  
  const [openingJEs] = await sequelize.query(`
    SELECT 
      je.id,
      je.entry_date,
      je.description,
      je.reference_type_id,
      rt.code as ref_type_code,
      rt.label as ref_type_label,
      et.name as entry_type_name,
      ROUND(SUM(jel.debit), 2) as total_debit,
      ROUND(SUM(jel.credit), 2) as total_credit,
      ROUND(SUM(jel.debit) - SUM(jel.credit), 2) as diff
    FROM journal_entries je
    LEFT JOIN reference_types rt ON je.reference_type_id = rt.id
    LEFT JOIN entry_types et ON je.entry_type_id = et.id
    LEFT JOIN journal_entry_lines jel ON jel.journal_entry_id = je.id
    WHERE 
      je.description LIKE '%افتتاح%' 
      OR rt.code LIKE '%opening%' 
      OR rt.label LIKE '%افتتاح%'
      OR et.name LIKE '%opening%'
      OR et.name LIKE '%افتتاح%'
    GROUP BY je.id
    ORDER BY je.id ASC
  `);

  console.log(`إجمالي عدد القيود الافتتاحية: ${openingJEs.length}`);
  const unbalancedOpening = openingJEs.filter(j => Math.abs(Number(j.diff)) > 0.01);
  console.log(`القيود الافتتاحية غير المتوازنة (Unbalanced): ${unbalancedOpening.length}`);

  const sumOpeningDebit = openingJEs.reduce((s, j) => s + Number(j.total_debit || 0), 0);
  const sumOpeningCredit = openingJEs.reduce((s, j) => s + Number(j.total_credit || 0), 0);
  console.log(`إجمالي المدين للقيود الافتتاحية: ${sumOpeningDebit.toFixed(2)} EGP`);
  console.log(`إجمالي الدائن للقيود الافتتاحية: ${sumOpeningCredit.toFixed(2)} EGP`);

  console.log('\n==================================================');
  console.log('2. فحص تفاصيل الحركات على حساب "الأرصدة الافتتاحية" (حساب 117)');
  console.log('==================================================');
  const [lines117] = await sequelize.query(`
    SELECT 
      jel.id,
      je.id as je_id,
      je.entry_date,
      je.description as je_desc,
      jel.description as line_desc,
      jel.debit,
      jel.credit,
      rt.code as ref_code,
      rt.label as ref_label
    FROM journal_entry_lines jel
    JOIN journal_entries je ON jel.journal_entry_id = je.id
    LEFT JOIN reference_types rt ON je.reference_type_id = rt.id
    WHERE jel.account_id = 117
    ORDER BY je.entry_date ASC, jel.id ASC
  `);
  console.log(`عدد الحركات المسجلة على حساب الأرصدة الافتتاحية: ${lines117.length}`);
  
  const debitLines117 = lines117.filter(l => Number(l.debit) > 0);
  const creditLines117 = lines117.filter(l => Number(l.credit) > 0);
  console.log(`الحركات المدينة على حساب 117 (الالتزامات الافتتاحية): عدد ${debitLines117.length} بإجمالي ${debitLines117.reduce((s, l) => s + Number(l.debit), 0).toFixed(2)}`);
  console.log(`الحركات الدائنة على حساب 117 (الأصول والمخزون والعملاء الافتتاحي): عدد ${creditLines117.length} بإجمالي ${creditLines117.reduce((s, l) => s + Number(l.credit), 0).toFixed(2)}`);
  
  console.log('\nنموذج من الحركات المدينة (الخصوم الافتتاحية):');
  console.log(debitLines117.slice(0, 5));
  console.log('\nنموذج من الحركات الدائنة (الأصول الافتتاحية):');
  console.log(creditLines117.slice(0, 5));

  console.log('\n==================================================');
  console.log('3. فحص الأرصدة الافتتاحية للمديونيات والمخزون والأصول');
  console.log('==================================================');
  const [openingInvoicesSummary] = await sequelize.query(`
    SELECT 
      COUNT(*) as count,
      SUM(total_amount) as total_amount
    FROM sales_invoices
    WHERE invoice_type = 'opening'
  `);
  console.log('فواتير العملاء الافتتاحية:', openingInvoicesSummary[0]);

  const [inventoryOpeningSummary] = await sequelize.query(`
    SELECT 
      COUNT(DISTINCT it.id) as trx_count,
      COUNT(DISTINCT it.product_id) as products_count,
      SUM(itb.quantity) as total_quantity,
      SUM(itb.quantity * itb.cost_per_unit) as total_value
    FROM inventory_transactions it
    JOIN inventory_transaction_batches itb ON itb.inventory_transaction_id = it.id
    WHERE it.source_type = 'opening'
  `);
  console.log('المخزون الافتتاحي:', inventoryOpeningSummary[0]);

  console.log('\n==================================================');
  console.log('4. هل يوجد قيد إقفال لحساب الأرصدة الافتتاحية في رأس المال أو حقوق الملكية؟');
  console.log('==================================================');
  const [closingOpeningAccount] = await sequelize.query(`
    SELECT 
      je.id,
      je.entry_date,
      je.description,
      jel.account_id,
      a.name as account_name,
      jel.debit,
      jel.credit
    FROM journal_entry_lines jel
    JOIN journal_entries je ON jel.journal_entry_id = je.id
    JOIN accounts a ON jel.account_id = a.id
    WHERE jel.journal_entry_id IN (
      SELECT journal_entry_id FROM journal_entry_lines WHERE account_id = 117
    ) AND a.account_type = 'equity' AND a.id != 117
  `);
  console.log(`قيود إقفال حساب الأرصدة الافتتاحية في رأس المال أو الأرباح المرحلة: ${closingOpeningAccount.length}`);
}

checkOpeningEntries().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
