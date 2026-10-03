import { sequelize } from '../src/models/index.js';

async function testFullReport() {
  const warehouseId = null;
  const startDate = '2026-01-01';
  const endDate = '2026-12-31';
  const onlyInStock = false;
  
  const warehouseConditionBatch = warehouseId ? `AND bi.warehouse_id = ${Number(warehouseId)}` : '';
  const warehouseConditionInflow = warehouseId ? `AND it.warehouse_id = ${Number(warehouseId)}` : '';
  let dateConditionInflow = '';
  if (startDate && endDate) {
    dateConditionInflow = `AND it.transaction_date BETWEEN '${startDate} 00:00:00' AND '${endDate} 23:59:59'`;
  } else if (startDate) {
    dateConditionInflow = `AND it.transaction_date >= '${startDate} 00:00:00'`;
  } else if (endDate) {
    dateConditionInflow = `AND it.transaction_date <= '${endDate} 23:59:59'`;
  }

  // 1. All products
  const products = await sequelize.query(`
    SELECT p.id, p.name, p.cost_price, p.price, u.name as unit_name
    FROM products p
    LEFT JOIN units u ON p.unit_id = u.id
    ORDER BY p.name ASC
  `, { type: sequelize.QueryTypes.SELECT });

  // 2. Batch stock with unit cost
  const batchStockQuery = `
    SELECT 
      bi.warehouse_id,
      w.name as warehouse_name,
      b.product_id,
      bi.batch_id,
      b.batch_number,
      b.expiry_date,
      bi.quantity as available_quantity,
      COALESCE(
        (
          SELECT itb.cost_per_unit 
          FROM inventory_transaction_batches itb
          JOIN inventory_transactions it ON itb.inventory_transaction_id = it.id
          WHERE itb.batch_id = b.id AND it.transaction_type = 'in'
          ORDER BY it.transaction_date ASC, itb.id ASC
          LIMIT 1
        ),
        p.cost_price,
        0
      ) as batch_unit_cost
    FROM batch_inventory bi
    JOIN batches b ON bi.batch_id = b.id
    JOIN products p ON b.product_id = p.id
    JOIN warehouses w ON bi.warehouse_id = w.id
    WHERE bi.quantity > 0 ${warehouseConditionBatch}
    ORDER BY b.expiry_date ASC, bi.batch_id ASC
  `;
  const batchRows = await sequelize.query(batchStockQuery, { type: sequelize.QueryTypes.SELECT });

  // 3. Inflow transactions summary
  const inflowSummaryQuery = `
    SELECT 
      it.product_id,
      SUM(itb.quantity) as total_inflow_quantity,
      SUM(itb.quantity * itb.cost_per_unit) as total_inflow_value,
      MIN(itb.cost_per_unit) as min_inflow_cost,
      MAX(itb.cost_per_unit) as max_inflow_cost,
      COUNT(itb.id) as inflow_trx_count
    FROM inventory_transaction_batches itb
    JOIN inventory_transactions it ON itb.inventory_transaction_id = it.id
    WHERE it.transaction_type = 'in' ${warehouseConditionInflow} ${dateConditionInflow}
    GROUP BY it.product_id
  `;
  const inflowRows = await sequelize.query(inflowSummaryQuery, { type: sequelize.QueryTypes.SELECT });

  // 4. Last inflow cost per product
  const lastInflowQuery = `
    SELECT it.product_id, itb.cost_per_unit as last_inflow_cost
    FROM inventory_transaction_batches itb
    JOIN inventory_transactions it ON itb.inventory_transaction_id = it.id
    INNER JOIN (
      SELECT it_sub.product_id, MAX(itb_sub.id) as max_itb_id
      FROM inventory_transaction_batches itb_sub
      JOIN inventory_transactions it_sub ON itb_sub.inventory_transaction_id = it_sub.id
      WHERE it_sub.transaction_type = 'in' 
        ${warehouseId ? `AND it_sub.warehouse_id = ${Number(warehouseId)}` : ''} 
        ${startDate && endDate ? `AND it_sub.transaction_date BETWEEN '${startDate} 00:00:00' AND '${endDate} 23:59:59'` : ''}
      GROUP BY it_sub.product_id
    ) latest ON it.product_id = latest.product_id AND itb.id = latest.max_itb_id
  `;
  const lastInflowRows = await sequelize.query(lastInflowQuery, { type: sequelize.QueryTypes.SELECT });

  // Map data
  const batchMap = {};
  batchRows.forEach(row => {
    if (!batchMap[row.product_id]) batchMap[row.product_id] = [];
    batchMap[row.product_id].push({
      batch_id: row.batch_id,
      batch_number: row.batch_number || 'بدون رقم',
      expiry_date: row.expiry_date,
      warehouse_id: row.warehouse_id,
      warehouse_name: row.warehouse_name,
      quantity: Number(row.available_quantity || 0),
      unit_cost: Number(row.batch_unit_cost || 0),
      total_value: Number(row.available_quantity || 0) * Number(row.batch_unit_cost || 0)
    });
  });

  const inflowMap = {};
  inflowRows.forEach(r => {
    inflowMap[r.product_id] = {
      total_inflow_quantity: Number(r.total_inflow_quantity || 0),
      total_inflow_value: Number(r.total_inflow_value || 0),
      min_inflow_cost: Number(r.min_inflow_cost || 0),
      max_inflow_cost: Number(r.max_inflow_cost || 0),
      inflow_trx_count: Number(r.inflow_trx_count || 0)
    };
  });

  const lastInflowMap = {};
  lastInflowRows.forEach(r => {
    lastInflowMap[r.product_id] = Number(r.last_inflow_cost || 0);
  });

  const warehouseStats = {};

  let items = products.map(p => {
    const pBatches = batchMap[p.id] || [];
    const pInflow = inflowMap[p.id] || {
      total_inflow_quantity: 0,
      total_inflow_value: 0,
      min_inflow_cost: 0,
      max_inflow_cost: 0,
      inflow_trx_count: 0
    };

    const currentQty = pBatches.reduce((s, b) => s + b.quantity, 0);
    const currentStockValue = pBatches.reduce((s, b) => s + b.total_value, 0);
    const catalogCost = Number(p.cost_price || 0);
    const sellingPrice = Number(p.price || 0);

    const currentAvgUnitCost = currentQty > 0
      ? currentStockValue / currentQty
      : (pInflow.total_inflow_quantity > 0 ? pInflow.total_inflow_value / pInflow.total_inflow_quantity : catalogCost);

    const inflowAvgCost = pInflow.total_inflow_quantity > 0
      ? pInflow.total_inflow_value / pInflow.total_inflow_quantity
      : 0;

    const costVariance = currentAvgUnitCost - catalogCost;
    const profitMarginPct = sellingPrice > 0
      ? ((sellingPrice - currentAvgUnitCost) / sellingPrice) * 100
      : 0;

    // Accumulate warehouse stats
    pBatches.forEach(b => {
      if (!warehouseStats[b.warehouse_name]) {
        warehouseStats[b.warehouse_name] = { name: b.warehouse_name, quantity: 0, value: 0 };
      }
      warehouseStats[b.warehouse_name].quantity += b.quantity;
      warehouseStats[b.warehouse_name].value += b.total_value;
    });

    return {
      product_id: p.id,
      product_name: p.name,
      unit_name: p.unit_name || 'قطعة',
      catalog_cost_price: catalogCost,
      selling_price: sellingPrice,
      current_quantity: currentQty,
      current_stock_value: Math.round(currentStockValue * 100) / 100,
      current_avg_unit_cost: Math.round(currentAvgUnitCost * 100) / 100,
      cost_variance: Math.round(costVariance * 100) / 100,
      profit_margin_pct: Math.round(profitMarginPct * 10) / 10,
      total_inflow_quantity: pInflow.total_inflow_quantity,
      total_inflow_value: Math.round(pInflow.total_inflow_value * 100) / 100,
      inflow_avg_unit_cost: Math.round(inflowAvgCost * 100) / 100,
      min_inflow_cost: pInflow.min_inflow_cost,
      max_inflow_cost: pInflow.max_inflow_cost,
      last_inflow_cost: lastInflowMap[p.id] || pInflow.max_inflow_cost || catalogCost,
      inflow_transactions_count: pInflow.inflow_trx_count,
      batches: pBatches
    };
  });

  if (onlyInStock) {
    items = items.filter(i => i.current_quantity > 0);
  }

  const totalStockQty = items.reduce((s, i) => s + i.current_quantity, 0);
  const totalStockVal = items.reduce((s, i) => s + i.current_stock_value, 0);
  const totalInflowQty = items.reduce((s, i) => s + i.total_inflow_quantity, 0);
  const totalInflowVal = items.reduce((s, i) => s + i.total_inflow_value, 0);

  const summary = {
    total_products_count: items.length,
    in_stock_products_count: items.filter(i => i.current_quantity > 0).length,
    total_stock_quantity: totalStockQty,
    total_stock_value: Math.round(totalStockVal * 100) / 100,
    overall_weighted_avg_cost: totalStockQty > 0 ? Math.round((totalStockVal / totalStockQty) * 100) / 100 : 0,
    total_inflow_quantity: totalInflowQty,
    total_inflow_value: Math.round(totalInflowVal * 100) / 100,
    overall_inflow_avg_cost: totalInflowQty > 0 ? Math.round((totalInflowVal / totalInflowQty) * 100) / 100 : 0
  };

  console.log('Summary:', summary);
  console.log('Sample top 2 items:', items.slice(0, 2));
}

testFullReport().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
