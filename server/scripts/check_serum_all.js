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

    // 1. All products
    const [products] = await c.execute(`SELECT id, name, type_id, price, cost_price FROM products`);
    out.products = products;

    // 2. Look for BOM
    const [boms] = await c.execute(`
        SELECT b.*, p.name as product_name, m.name as material_name 
        FROM bill_of_materials b
        LEFT JOIN products p ON p.id = b.product_id
        LEFT JOIN products m ON m.id = b.material_id
    `);
    out.boms = boms;

    // 3. External Job Orders
    const [ejo] = await c.execute(`
        SELECT e.*, p.name as product_name
        FROM external_job_orders e
        LEFT JOIN products p ON p.id = e.product_id
    `);
    out.job_orders = ejo;

    // 4. External Job Order Items
    const [ejoi] = await c.execute(`
        SELECT i.*, p.name as product_name
        FROM external_job_order_items i
        LEFT JOIN products p ON p.id = i.product_id
    `);
    out.job_order_items = ejoi;

    // 5. Job Order Cost Transactions / Services
    try {
        const [services] = await c.execute(`SELECT * FROM external_job_order_services`);
        out.job_order_services = services;
    } catch (e) {
        out.job_order_services_error = e.message;
    }

    try {
        const [costTrx] = await c.execute(`SELECT * FROM job_order_cost_transactions`);
        out.cost_transactions = costTrx;
    } catch (e) {
        out.cost_transactions_error = e.message;
    }

    // 6. Issue Vouchers & items
    try {
        const [vouchers] = await c.execute(`SELECT * FROM issue_vouchers ORDER BY id DESC LIMIT 20`);
        const [vItems] = await c.execute(`
            SELECT ivi.*, p.name as product_name 
            FROM issue_voucher_items ivi
            LEFT JOIN products p ON p.id = ivi.product_id
            ORDER BY ivi.id DESC LIMIT 50
        `);
        out.issue_vouchers = vouchers;
        out.issue_voucher_items = vItems;
    } catch (e) {
        out.vouchers_error = e.message;
    }

    // 7. Issue Voucher Returns
    try {
        const [returns] = await c.execute(`SELECT * FROM issue_voucher_returns ORDER BY id DESC LIMIT 20`);
        const [rItems] = await c.execute(`
            SELECT ivri.*, p.name as product_name 
            FROM issue_voucher_return_items ivri
            LEFT JOIN products p ON p.id = ivri.product_id
            ORDER BY ivri.id DESC LIMIT 50
        `);
        out.issue_voucher_returns = returns;
        out.issue_voucher_return_items = rItems;
    } catch (e) {
        out.returns_error = e.message;
    }

    // 8. Purchase Invoices & Items for items 21 & 25
    try {
        const [pii] = await c.execute(`
            SELECT pii.*, pi.invoice_number, pi.invoice_date, p.name as product_name
            FROM purchase_invoice_items pii
            JOIN purchase_invoices pi ON pi.id = pii.purchase_invoice_id
            JOIN products p ON p.id = pii.product_id
            WHERE pii.product_id IN (21, 25)
        `);
        out.purchases_21_25 = pii;
    } catch (e) {
        out.purchases_error = e.message;
    }

    // 9. Inventory transactions for 21 and 25
    try {
        const [invTrx] = await c.execute(`
            SELECT it.*, p.name as product_name
            FROM inventory_transactions it
            JOIN products p ON p.id = it.product_id
            WHERE it.product_id IN (21, 25)
            ORDER BY it.id DESC
        `);
        out.inventory_transactions_21_25 = invTrx;
    } catch (e) {
        out.invTrx_error = e.message;
    }

    // 10. Inventory transactions for Serum products
    try {
        const [serumTrx] = await c.execute(`
            SELECT it.*, p.name as product_name
            FROM inventory_transactions it
            JOIN products p ON p.id = it.product_id
            WHERE p.name LIKE '%سير%' OR p.name LIKE '%serum%' OR p.name LIKE '%Serum%'
            ORDER BY it.id DESC
        `);
        out.serum_inventory_transactions = serumTrx;
    } catch (e) {
        out.serumTrx_error = e.message;
    }

    fs.writeFileSync('d:/db/server/serum_debug.json', JSON.stringify(out, null, 2), 'utf-8');
    console.log('Done writing d:/db/server/serum_debug.json');
    await c.end();
}

main().catch(console.error);
