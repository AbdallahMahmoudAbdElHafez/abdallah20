import mysql from 'mysql2/promise';

async function main() {
    const c = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'Abdallah20203040',
        database: 'nurivina_erp'
    });

    console.log('=== CHECK ORDERS 3, 4, 5, 6 DETAILS ===');
    const [orders] = await c.execute(`
        SELECT ejo.id, ejo.product_id, p.name as product_name, ejo.order_quantity, ejo.produced_quantity, ejo.waste_quantity,
               ejo.actual_processing_cost_per_unit, ejo.actual_raw_material_cost_per_unit, ejo.total_actual_cost, p.cost_price as current_product_cost
        FROM external_job_orders ejo
        JOIN products p ON p.id = ejo.product_id
        WHERE ejo.id IN (3, 4, 5, 6)
    `);
    console.table(orders);

    console.log('=== INVOICES FOR 3, 4, 5, 6 ===');
    const [invs] = await c.execute(`
        SELECT esi.id as inv_id, esi.job_order_id, esi.party_id, pa.name as party_name, esii.quantity, esii.unit_price, esii.line_total
        FROM external_service_invoices esi
        JOIN external_service_invoice_items esii ON esii.invoice_id = esi.id
        JOIN parties pa ON pa.id = esi.party_id
        WHERE esi.job_order_id IN (3, 4, 5, 6)
    `);
    console.table(invs);

    console.log('=== JOURNAL ENTRY CLOSING LINES FOR 3, 4, 5, 6 ===');
    const [jel] = await c.execute(`
        SELECT je.id as je_id, je.reference_id as jo_id, jel.account_id, a.name as acc_name, jel.debit, jel.credit, jel.description
        FROM journal_entries je
        JOIN journal_entry_lines jel ON jel.journal_entry_id = je.id
        JOIN accounts a ON a.id = jel.account_id
        JOIN reference_types rt ON rt.id = je.reference_type_id
        WHERE rt.code = 'external_job_order_receive' AND je.reference_id IN (3, 4, 5, 6)
        ORDER BY je.reference_id, jel.id
    `);
    console.table(jel);

    await c.end();
}

main().catch(console.error);
