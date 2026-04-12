const mysql = require('mysql2/promise');

(async () => {
    const c = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'Abdallah20203040',
        database: 'nurivina_erp'
    });

    console.log('=== فواتير المنتج 10 في الدقهلية (2026) ===\n');

    const [rows] = await c.execute(`
        SELECT 
            si.id as invoice_id, 
            si.invoice_number, 
            si.invoice_date,
            sii.id as item_id, 
            sii.quantity as sold_qty, 
            sii.price as sell_price,
            sii.discount,
            sii.bonus,
            it.id as trx_id,
            itb.id as itb_id,
            itb.quantity as batch_qty, 
            itb.cost_per_unit
        FROM sales_invoices si
        JOIN sales_invoice_items sii ON sii.sales_invoice_id = si.id
        JOIN parties pa ON pa.id = si.party_id
        JOIN cities ci ON ci.id = pa.city_id
        JOIN governates g ON g.id = ci.governate_id
        LEFT JOIN inventory_transactions it ON it.source_id = sii.id AND it.source_type = 'sales_invoice'
        LEFT JOIN inventory_transaction_batches itb ON itb.inventory_transaction_id = it.id
        WHERE sii.product_id = 10 
          AND g.name = 'الدقهليه'
          AND si.invoice_type = 'normal'
          AND si.invoice_status != 'cancelled'
          AND si.invoice_date BETWEEN '2026-01-01' AND '2026-12-31'
        ORDER BY si.invoice_date, si.id, sii.id, itb.id
    `);

    let totalSoldQty = 0;
    let totalRevenue = 0;
    let totalCost = 0;
    const seenItems = new Set();

    rows.forEach(r => {
        console.log(
            `فاتورة: ${r.invoice_number} | تاريخ: ${r.invoice_date} | ` +
            `item_id: ${r.item_id} | كمية_بيع: ${r.sold_qty} | سعر: ${r.sell_price} | خصم: ${r.discount} | ` +
            `trx: ${r.trx_id} | batch_qty: ${r.batch_qty} | cost_per_unit: ${r.cost_per_unit}`
        );

        if (!seenItems.has(r.item_id)) {
            totalSoldQty += r.sold_qty;
            totalRevenue += (r.sold_qty * parseFloat(r.sell_price)) - parseFloat(r.discount || 0);
            seenItems.add(r.item_id);
        }

        if (r.batch_qty && r.cost_per_unit) {
            totalCost += r.batch_qty * parseFloat(r.cost_per_unit);
        }
    });

    console.log('\n=== الإجمالي ===');
    console.log('الكمية المباعة:', totalSoldQty);
    console.log('الإيراد:', totalRevenue.toFixed(2));
    console.log('التكلفة (من الباتشات):', totalCost.toFixed(2));
    console.log('الربح:', (totalRevenue - totalCost).toFixed(2));

    // Now check what the API returns
    console.log('\n=== ما يرجعه الـ API ===');
    const http = require('http');
    const apiData = await new Promise((resolve, reject) => {
        http.get('http://localhost:5000/api/reports/sales?startDate=2026-01-01&endDate=2026-12-31', res => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(JSON.parse(data)));
        }).on('error', reject);
    });

    const match = apiData.cogsByRegionProduct.find(
        r => r.region === 'الدقهليه' && r.product.includes('Dandruff')
    );
    if (match) {
        console.log('API result:', JSON.stringify(match, null, 2));
    } else {
        console.log('لم يتم العثور على المنتج 10 في الدقهلية في الـ API');
        // Try to find close matches
        const dakahlia = apiData.cogsByRegionProduct.filter(r => r.region === 'الدقهليه');
        console.log('بيانات الدقهلية:', dakahlia.map(r => r.product + ' -> cost:' + r.cost));
    }

    await c.end();
})();
