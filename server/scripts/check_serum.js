import mysql from 'mysql2/promise';

async function main() {
    const c = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'Abdallah20203040',
        database: 'nurivina_erp'
    });

    console.log('=== PRODUCTS MATCHING SERUM / سير ===');
    const [serumProducts] = await c.execute(`
        SELECT p.*, pt.name as type_name
        FROM products p
        LEFT JOIN product_types pt ON pt.id = p.type_id
        WHERE p.name LIKE '%سير%' OR p.name LIKE '%serum%' OR p.name LIKE '%Serum%'
    `);
    console.log(JSON.stringify(serumProducts, null, 2));

    console.log('=== PRODUCTS 21 AND 25 ===');
    const [items21_25] = await c.execute(`
        SELECT p.*, pt.name as type_name
        FROM products p
        LEFT JOIN product_types pt ON pt.id = p.type_id
        WHERE p.id IN (21, 25)
    `);
    console.log(JSON.stringify(items21_25, null, 2));

    console.log('=== ALL PRODUCT TYPES ===');
    const [productTypes] = await c.execute(`SELECT * FROM product_types`);
    console.log(JSON.stringify(productTypes, null, 2));

    console.log('=== ALL JOB ORDERS ===');
    const [jobOrders] = await c.execute(`
        SELECT ejo.*, p.name as product_name
        FROM external_job_orders ejo
        LEFT JOIN products p ON p.id = ejo.product_id
        ORDER BY ejo.id DESC
    `);
    console.log(JSON.stringify(jobOrders, null, 2));

    console.log('=== JOB ORDER ITEMS FOR ALL JOB ORDERS OR PRODUCTS 21/25 ===');
    const [jobOrderItems] = await c.execute(`
        SELECT ejoi.*, p.name as product_name
        FROM external_job_order_items ejoi
        LEFT JOIN products p ON p.id = ejoi.product_id
        ORDER BY ejoi.id DESC
    `);
    console.log(JSON.stringify(jobOrderItems, null, 2));

    console.log('=== ISSUE VOUCHERS AND ITEMS (سندات الصرف) ===');
    const [vouchers] = await c.execute(`
        SELECT iv.*, ivi.product_id, p.name as product_name, ivi.quantity, ivi.unit_cost, ivi.total_cost
        FROM issue_vouchers iv
        LEFT JOIN issue_voucher_items ivi ON ivi.issue_voucher_id = iv.id
        LEFT JOIN products p ON p.id = ivi.product_id
        ORDER BY iv.id DESC
        LIMIT 50
    `);
    console.log(JSON.stringify(vouchers, null, 2));

    console.log('=== ISSUE VOUCHER RETURNS (مرتجعات الصرف) ===');
    const [returns] = await c.execute(`
        SELECT ivr.*, ivri.product_id, p.name as product_name, ivri.quantity, ivri.unit_cost, ivri.total_cost
        FROM issue_voucher_returns ivr
        LEFT JOIN issue_voucher_return_items ivri ON ivri.issue_voucher_return_id = ivr.id
        LEFT JOIN products p ON p.id = ivri.product_id
        ORDER BY ivr.id DESC
        LIMIT 50
    `);
    console.log(JSON.stringify(returns, null, 2));

    await c.end();
}

main().catch(console.error);
