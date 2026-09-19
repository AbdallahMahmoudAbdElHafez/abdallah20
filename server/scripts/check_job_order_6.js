import mysql from 'mysql2/promise';
import fs from 'fs';

async function main() {
    const c = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'Abdallah20203040',
        database: 'nurivina_erp'
    });

    const out = {};

    const [parties] = await c.execute(`SELECT * FROM parties WHERE id = 74`);
    out.party_74 = parties;

    const [jo6] = await c.execute(`SELECT * FROM external_job_orders WHERE id = 6`);
    out.job_order_6 = jo6;

    const [items] = await c.execute(`
        SELECT ejoi.*, p.name as product_name, b.batch_number
        FROM external_job_order_items ejoi
        LEFT JOIN products p ON p.id = ejoi.product_id
        LEFT JOIN batches b ON b.id = ejoi.batch_id
        WHERE ejoi.job_order_id = 6
    `);
    out.items = items;

    try {
        const [services] = await c.execute(`SELECT * FROM external_job_order_services WHERE job_order_id = 6`);
        out.services = services;
    } catch(e) { out.services_err = e.message; }

    try {
        const [costTrx] = await c.execute(`SELECT * FROM job_order_cost_transactions WHERE job_order_id = 6`);
        out.cost_transactions = costTrx;
    } catch(e) { out.cost_transactions_err = e.message; }

    try {
        const [serviceInv] = await c.execute(`
            SELECT esi.*, esii.service_type_id, esii.quantity, esii.unit_price, esii.line_total
            FROM external_service_invoices esi
            LEFT JOIN external_service_invoice_items esii ON esii.invoice_id = esi.id
            WHERE esi.job_order_id = 6 OR esi.party_id = 74
        `);
        out.service_invoices = serviceInv;
    } catch(e) { out.service_invoices_err = e.message; }

    try {
        const [je] = await c.execute(`
            SELECT je.id as je_id, je.entry_date, je.description as je_desc, rt.code as ref_type,
                   jel.id as line_id, jel.account_id, a.code as acc_code, a.name as acc_name, jel.debit, jel.credit, jel.description as line_desc
            FROM journal_entries je
            LEFT JOIN reference_types rt ON rt.id = je.reference_type_id
            LEFT JOIN journal_entry_lines jel ON jel.journal_entry_id = je.id
            LEFT JOIN accounts a ON a.id = jel.account_id
            WHERE (je.reference_id = 6 AND rt.code LIKE '%job_order%')
               OR je.description LIKE '%6%'
            ORDER BY je.id, jel.id
        `);
        out.journal_entries = je;
    } catch(e) { out.journal_entries_err = e.message; }

    try {
        const [invTrx] = await c.execute(`
            SELECT it.*, itb.batch_id, itb.quantity as itb_qty, itb.cost_per_unit as itb_cpu, p.name as product_name
            FROM inventory_transactions it
            LEFT JOIN inventory_transaction_batches itb ON itb.inventory_transaction_id = it.id
            LEFT JOIN products p ON p.id = it.product_id
            WHERE it.source_id = 6 AND it.source_type = 'external_job_order'
        `);
        out.inv_transactions = invTrx;
    } catch(e) { out.inv_transactions_err = e.message; }

    try {
        const [bom] = await c.execute(`
            SELECT b.*, p.name as material_name, p.cost_price as material_cost
            FROM bill_of_materials b
            JOIN products p ON p.id = b.material_id
            WHERE b.product_id = 2
        `);
        out.bom_product_2 = bom;
    } catch(e) { out.bom_err = e.message; }

    // Let's also check all purchase invoices or costs for items 21 and 25
    try {
        const [purchases] = await c.execute(`
            SELECT pii.*, pi.invoice_number, pi.invoice_date, p.name as product_name
            FROM purchase_invoice_items pii
            JOIN purchase_invoices pi ON pi.id = pii.purchase_invoice_id
            JOIN products p ON p.id = pii.product_id
            WHERE pii.product_id IN (21, 25)
        `);
        out.purchases_21_25 = purchases;
    } catch(e) { out.purchases_err = e.message; }

    fs.writeFileSync('d:/db/server/jo6_full_analysis.json', JSON.stringify(out, null, 2), 'utf-8');
    console.log('Successfully wrote jo6_full_analysis.json');

    await c.end();
}

main().catch(console.error);
