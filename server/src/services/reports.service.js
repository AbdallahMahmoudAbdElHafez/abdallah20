import {
    SalesInvoice,
    SalesInvoiceItem,
    PurchaseInvoice,
    PurchaseInvoiceItem,
    Expense,
    ExternalJobOrder,
    Product,
    CurrentInventory,
    InventoryTransaction,
    InventoryTransactionBatches,
    Party,
    Employee,
    Warehouse,
    City,
    Governate,
    IssueVoucher,
    IssueVoucherItem,
    sequelize
} from '../models/index.js';
import { Op } from 'sequelize';

const getDashboardSummary = async (startDate, endDate) => {
    const dateFilter = {};
    if (startDate && endDate) {
        dateFilter.date = { [Op.between]: [startDate, endDate] };
    } else if (startDate) {
        dateFilter.date = { [Op.gte]: startDate };
    } else if (endDate) {
        dateFilter.date = { [Op.lte]: endDate };
    }

    console.log('Service: getDashboardSummary', { startDate, endDate, dateFilter });

    // Sales Total
    const totalSales = await SalesInvoice.sum('total_amount', {
        where: {
            ...(startDate || endDate ? { invoice_date: dateFilter.date } : {}),
            invoice_type: 'normal'
        }
    }) || 0;

    // Purchases Total
    const totalPurchases = await PurchaseInvoice.sum('total_amount', {
        where: startDate || endDate ? { invoice_date: dateFilter.date } : {}
    }) || 0;

    // Expenses Total
    const totalExpenses = await Expense.sum('amount', {
        where: startDate || endDate ? { expense_date: dateFilter.date } : {}
    }) || 0;

    const netProfit = totalSales - totalPurchases - totalExpenses;

    return {
        totalSales,
        totalPurchases,
        totalExpenses,
        netProfit
    };
};

const getTopSellingProducts = async (startDate, endDate, limit = 5) => {
    const dateFilter = {};
    if (startDate && endDate) {
        dateFilter.invoice_date = { [Op.between]: [startDate, endDate] };
    }

    const topProducts = await SalesInvoiceItem.findAll({
        attributes: [
            'product_id',
            [sequelize.fn('SUM', sequelize.col('sales_invoice_items.quantity')), 'total_quantity'],
            [sequelize.literal('SUM((sales_invoice_items.quantity * sales_invoice_items.price) - sales_invoice_items.discount + sales_invoice_items.tax_amount + sales_invoice_items.vat_amount)'), 'total_revenue']
        ],
        include: [
            {
                model: SalesInvoice,
                as: 'sales_invoice',
                attributes: [],
                where: {
                    ...(startDate || endDate ? dateFilter : {}),
                    invoice_type: 'normal'
                }
            },
            {
                model: Product,
                as: 'product',
                attributes: ['name']
            }
        ],
        group: ['product_id', sequelize.col('product.id'), sequelize.col('product.name')],
        order: [[sequelize.literal('total_revenue'), 'DESC']],
        limit
    });

    return topProducts;
};

const getLowStockItems = async (threshold = 10) => {
    const lowStockItems = await CurrentInventory.findAll({
        attributes: [
            'product_id',
            [sequelize.fn('SUM', sequelize.col('quantity')), 'total_balance']
        ],
        include: [
            {
                model: Product,
                as: 'product',
                attributes: ['name', 'price']
            }
        ],
        group: ['product_id', sequelize.col('product.id'), sequelize.col('product.name'), sequelize.col('product.price')],
        having: sequelize.where(sequelize.fn('SUM', sequelize.col('quantity')), '<', threshold),
        order: [[sequelize.literal('total_balance'), 'ASC']],
        limit: 20
    });

    return lowStockItems;
};

// ============ NEW REPORTS ============

/**
 * Sales Report - Detailed
 */
const getSalesReport = async (startDate, endDate) => {
    const dateFilter = {};
    if (startDate && endDate) {
        dateFilter.invoice_date = { [Op.between]: [startDate, endDate] };
    } else if (startDate) {
        dateFilter.invoice_date = { [Op.gte]: startDate };
    } else if (endDate) {
        dateFilter.invoice_date = { [Op.lte]: endDate };
    }
    dateFilter.invoice_type = 'normal';

    const sales = await SalesInvoice.findAll({
        where: dateFilter,
        include: [
            {
                model: Party,
                as: 'party',
                attributes: ['id', 'name'],
                include: [{
                    model: City,
                    as: 'city',
                    attributes: ['name'],
                    include: [{
                        model: Governate,
                        as: 'governate',
                        attributes: ['name']
                    }]
                }]
            },
            {
                model: Employee,
                as: 'employee',
                attributes: ['id', 'name'],
                required: false
            },
            {
                model: Warehouse,
                as: 'warehouse',
                attributes: ['id', 'name'],
                required: false
            },
            {
                model: SalesInvoiceItem,
                as: 'items',
                include: [
                    {
                        model: Product,
                        as: 'product',
                        attributes: ['name', 'cost_price']
                    },
                    {
                        model: InventoryTransaction,
                        as: 'inventory_transactions',
                        required: false,
                        include: [{
                            model: InventoryTransactionBatches,
                            as: 'transaction_batches',
                            required: false
                        }]
                    }
                ]
            }
        ],
        order: [['invoice_date', 'DESC']]
    });

    // Calculate summary
    const summary = {
        total_invoices: sales.length,
        total_amount: sales.reduce((sum, inv) => sum + parseFloat(inv.total_amount || 0), 0),
        total_tax: sales.reduce((sum, inv) => sum + parseFloat(inv.tax_amount || 0) + parseFloat(inv.vat_amount || 0), 0),
        total_vat: sales.reduce((sum, inv) => sum + parseFloat(inv.vat_amount || 0), 0),
        total_discount: sales.reduce((sum, inv) => sum + parseFloat(inv.discount_amount || 0), 0)
    };

    // Group by month for chart
    const chartData = {};
    const employeeData = {};
    const employeeProductStats = {}; // [NEW] Track stats per employee + product
    const regionData = {};

    // Product Aggregation (Pivot Data)
    const productStats = {};

    sales.forEach(sale => {
        const total = parseFloat(sale.total_amount || 0);

        // Monthly Data
        const month = sale.invoice_date?.substring(0, 7) || 'Unknown'; // YYYY-MM
        if (!chartData[month]) {
            chartData[month] = 0;
        }
        chartData[month] += total;

        // Employee Data
        const empName = sale.employee?.name || 'غير محدد';
        if (!employeeData[empName]) {
            employeeData[empName] = 0;
        }
        employeeData[empName] += total;

        // Region Data (Governate -> City -> Unknown)
        let regionName = 'غير محدد';
        if (sale.party?.city?.governate?.name) {
            regionName = sale.party.city.governate.name;
        } else if (sale.party?.city?.name) {
            regionName = sale.party.city.name;
        }

        if (!regionData[regionName]) {
            regionData[regionName] = 0;
        }
        regionData[regionName] += total;

        // --- Product Performance Aggregation ---
        if (sale.items && sale.items.length > 0) {
            sale.items.forEach(item => {
                const productId = item.product_id;
                const productName = item.product?.name || `Product ${productId}`;
                const qty = parseFloat(item.quantity || 0);
                const price = parseFloat(item.price || 0);
                const discount = parseFloat(item.discount || 0);
                const tax = parseFloat(item.tax_amount || 0);
                const vat = parseFloat(item.vat_amount || 0);
                const revenue = (qty * price) - discount + tax + vat;

                if (!productStats[productId]) {
                    productStats[productId] = {
                        product: productName,
                        quantity: 0,
                        bonus: 0, // [NEW] Init bonus
                        revenue: 0,
                        cost: 0
                    };
                }

                productStats[productId].quantity += qty;
                productStats[productId].bonus += parseInt(item.bonus || 0); // [NEW] Aggregate bonus
                productStats[productId].revenue += revenue;

                // Calculate Cost from Batches
                let itemCost = 0;
                if (item.inventory_transactions && item.inventory_transactions.length > 0) {
                    item.inventory_transactions.forEach(trx => {
                        if (trx.transaction_batches && trx.transaction_batches.length > 0) {
                            trx.transaction_batches.forEach(batch => {
                                itemCost += parseFloat(batch.quantity || 0) * parseFloat(batch.cost_per_unit || 0);
                            });
                        } else {
                            // Fallback if no batches found (e.g. historical data or unbatched) defined in trx or product cost
                            // This fallback logic might need to be robust. 
                            // If transaction exists but no batches, maybe use product cost_price?
                            const trxQty = parseFloat(trx.quantity || 0);
                            // Try to find a cost, fallback to product.cost_price which was eagerly loaded
                            const costRef = item.product?.cost_price || 0;
                            itemCost += trxQty * parseFloat(costRef);
                        }
                    });
                } else {
                    // Fallback to average cost or standard cost if no transaction link (shouldn't happen for new architecture)
                    const costRef = item.product?.cost_price || 0;
                    itemCost += qty * parseFloat(costRef);
                }

                productStats[productId].cost += itemCost;

                // --- [NEW] Employee + Product Performance Aggregation ---
                const empName = sale.employee?.name || 'غير محدد';
                const epKey = `${empName}_${productId}`;
                if (!employeeProductStats[epKey]) {
                    employeeProductStats[epKey] = {
                        employee: empName,
                        product: productName,
                        quantity: 0,
                        revenue: 0
                    };
                }
                employeeProductStats[epKey].quantity += qty;
                employeeProductStats[epKey].revenue += revenue;
            });
        }
    });

    const chartArray = Object.keys(chartData).sort().map(month => ({
        month,
        amount: chartData[month]
    }));

    const salesByEmployee = Object.keys(employeeData).map(name => ({
        name,
        value: employeeData[name]
    })).sort((a, b) => b.value - a.value);

    const salesByRegion = Object.keys(regionData).map(name => ({
        name,
        value: regionData[name]
    })).sort((a, b) => b.value - a.value);

    // Convert Product Stats to Array
    const salesByProduct = Object.values(productStats).map(stat => ({
        ...stat,
        profit: stat.revenue - stat.cost,
        margin: stat.revenue > 0 ? ((stat.revenue - stat.cost) / stat.revenue) * 100 : 0
    })).sort((a, b) => b.revenue - a.revenue);

    const salesByEmployeeProduct = Object.values(employeeProductStats)
        .sort((a, b) => a.employee.localeCompare(b.employee) || b.revenue - a.revenue);

    return {
        data: sales,
        summary,
        chartData: chartArray,
        salesByEmployee,
        salesByRegion,
        salesByProduct, // New Pivot Data attached
        salesByEmployeeProduct // [NEW] Data for employee-product analysis
    };
};

/**
 * Purchases Report - Detailed
 */
const getPurchasesReport = async (startDate, endDate) => {
    const dateFilter = {};
    if (startDate && endDate) {
        dateFilter.invoice_date = { [Op.between]: [startDate, endDate] };
    } else if (startDate) {
        dateFilter.invoice_date = { [Op.gte]: startDate };
    } else if (endDate) {
        dateFilter.invoice_date = { [Op.lte]: endDate };
    }

    const purchases = await PurchaseInvoice.findAll({
        where: dateFilter,
        include: [
            {
                model: Party,
                as: 'supplier',
                attributes: ['id', 'name']
            },
            {
                model: PurchaseInvoiceItem,
                as: 'items',
                include: [{
                    model: Product,
                    as: 'product',
                    attributes: ['name']
                }]
            }
        ],
        order: [['invoice_date', 'DESC']]
    });

    const summary = {
        total_invoices: purchases.length,
        total_amount: purchases.reduce((sum, inv) => sum + parseFloat(inv.total_amount || 0), 0),
        total_tax: purchases.reduce((sum, inv) => sum + parseFloat(inv.tax_amount || 0), 0),
        total_discount: purchases.reduce((sum, inv) => sum + parseFloat(inv.discount_amount || 0), 0)
    };

    // Group by supplier for chart
    const chartData = {};
    purchases.forEach(purchase => {
        const supplier = purchase.supplier?.name || 'Unknown';
        if (!chartData[supplier]) {
            chartData[supplier] = 0;
        }
        chartData[supplier] += parseFloat(purchase.total_amount || 0);
    });

    const chartArray = Object.keys(chartData).map(supplier => ({
        supplier,
        amount: chartData[supplier]
    })).sort((a, b) => b.amount - a.amount).slice(0, 10); // Top 10 suppliers

    return {
        data: purchases,
        summary,
        chartData: chartArray
    };
};

/**
 * Expenses Report - Detailed
 */
const getExpensesReport = async (startDate, endDate) => {
    const dateFilter = {};
    if (startDate && endDate) {
        dateFilter.expense_date = { [Op.between]: [startDate, endDate] };
    } else if (startDate) {
        dateFilter.expense_date = { [Op.gte]: startDate };
    } else if (endDate) {
        dateFilter.expense_date = { [Op.lte]: endDate };
    }

    // Fetch expenses without expense_category to avoid table not found error
    const expenses = await Expense.findAll({
        where: dateFilter,
        order: [['expense_date', 'DESC']]
    });

    const summary = {
        total_expenses: expenses.length,
        total_amount: expenses.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0)
    };

    // Simplified summary since categories are removed
    const chartArray = [{
        category: 'مصروفات',
        amount: summary.total_amount
    }];

    return {
        data: expenses,
        summary,
        chartData: chartArray
    };
};

/**
 * Job Orders Report - Detailed
 */
const getJobOrdersReport = async (startDate, endDate) => {
    const dateFilter = {};
    if (startDate && endDate) {
        dateFilter.start_date = { [Op.between]: [startDate, endDate] };
    } else if (startDate) {
        dateFilter.start_date = { [Op.gte]: startDate };
    } else if (endDate) {
        dateFilter.start_date = { [Op.lte]: endDate };
    }

    const jobOrders = await ExternalJobOrder.findAll({
        where: dateFilter,
        include: [
            {
                model: Party,
                as: 'party',
                attributes: ['id', 'name']
            },
            {
                model: Product,
                as: 'product',
                attributes: ['id', 'name']
            }
        ],
        order: [['start_date', 'DESC']]
    });

    const summary = {
        total_orders: jobOrders.length,
        completed: jobOrders.filter(jo => jo.status === 'completed').length,
        in_progress: jobOrders.filter(jo => jo.status === 'in_progress').length,
        planned: jobOrders.filter(jo => jo.status === 'planned').length,
        cancelled: jobOrders.filter(jo => jo.status === 'cancelled').length,
        total_cost: jobOrders.reduce((sum, jo) => sum + parseFloat(jo.total_actual_cost || 0), 0)
    };

    // Group by status for chart
    const chartData = [
        { status: 'مخطط', count: summary.planned },
        { status: 'قيد التنفيذ', count: summary.in_progress },
        { status: 'مكتمل', count: summary.completed },
        { status: 'ملغي', count: summary.cancelled }
    ];

    return {
        data: jobOrders,
        summary,
        chartData
    };
};

/**
 * Issue Vouchers Report - Detailed
 */
const getIssueVouchersReport = async (startDate, endDate) => {
    const dateFilter = {};
    if (startDate && endDate) {
        dateFilter.issue_date = { [Op.between]: [startDate, endDate] };
    } else if (startDate) {
        dateFilter.issue_date = { [Op.gte]: startDate };
    } else if (endDate) {
        dateFilter.issue_date = { [Op.lte]: endDate };
    }

    const vouchers = await IssueVoucher.findAll({
        where: dateFilter,
        include: [
            {
                model: Party,
                as: 'party',
                attributes: ['id', 'name']
            },
            {
                model: Warehouse,
                as: 'warehouse',
                attributes: ['id', 'name']
            },
            {
                model: Employee,
                as: 'responsible_employee',
                attributes: ['id', 'name']
            },
            {
                model: IssueVoucherItem,
                as: 'items',
                include: [
                    {
                        model: Product,
                        as: 'product',
                        attributes: ['id', 'name', 'cost_price']
                    },
                    {
                        model: InventoryTransaction,
                        as: 'inventory_transactions',
                        required: false,
                        include: [{
                            model: InventoryTransactionBatches,
                            as: 'transaction_batches',
                            required: false
                        }]
                    }
                ]
            }
        ],
        order: [['issue_date', 'DESC']]
    });

    let totalVouchers = 0;
    let totalItems = 0;
    let totalCost = 0;

    const chartData = {}; // By Warehouse

    // Enhance vouchers with calculated cost
    const enhancedVouchers = vouchers.map(voucher => {
        let voucherCost = 0;
        let voucherItemsQty = 0;

        const enhancedItems = voucher.items.map(item => {
            let itemCost = 0;
            const itemQty = parseFloat(item.quantity || 0);

            if (item.inventory_transactions && item.inventory_transactions.length > 0) {
                item.inventory_transactions.forEach(trx => {
                    if (trx.transaction_batches && trx.transaction_batches.length > 0) {
                        trx.transaction_batches.forEach(batch => {
                            itemCost += parseFloat(batch.quantity || 0) * parseFloat(batch.cost_per_unit || 0);
                        });
                    } else {
                        // Fallback if transaction exists but no batches
                        // Assuming trx.quantity matches contribution to this item
                        // This is tricky if multiple transactions per item (unlikely for issue voucher item source)
                        const qty = parseFloat(trx.quantity || 0);
                        const costRef = item.product?.cost_price || 0;
                        itemCost += qty * parseFloat(costRef);
                    }
                });
            } else {
                // Fallback if no transaction found
                const costRef = item.product?.cost_price || 0;
                itemCost += itemQty * parseFloat(costRef);
            }

            voucherCost += itemCost;
            voucherItemsQty += itemQty;

            return {
                ...item.toJSON(),
                total_cost: itemCost
            };
        });

        totalVouchers++;
        totalItems += voucherItemsQty;
        totalCost += voucherCost;

        // Chart Data (Warehouse)
        const warehouseName = voucher.warehouse?.name || 'Unknown';
        if (!chartData[warehouseName]) {
            chartData[warehouseName] = 0;
        }
        chartData[warehouseName] += voucherCost;

        return {
            ...voucher.toJSON(),
            items: enhancedItems,
            total_cost: voucherCost,
            total_items: voucherItemsQty
        };
    });

    const summary = {
        total_vouchers: totalVouchers,
        total_items: totalItems,
        total_cost: totalCost
    };

    const chartArray = Object.keys(chartData).map(name => ({
        name,
        value: chartData[name]
    })).sort((a, b) => b.value - a.value);

    return {
        data: enhancedVouchers,
        summary,
        chartData: chartArray
    };
};

// ... (existing code)

/**
 * Warehouse Report (Inventory Valuation)
 */
const getWarehouseReport = async (date = null) => {
    let inventory = [];

    if (date) {
        // --- Historical Mode: Replay Transactions ---
        // Fetch all transactions up to the date
        const transactions = await InventoryTransaction.findAll({
            where: {
                transaction_date: { [Op.lte]: new Date(date) } // End of the selected day? Usually date input is YYYY-MM-DD
            },
            include: [
                {
                    model: InventoryTransactionBatches,
                    as: 'transaction_batches',
                    attributes: ['quantity', 'cost_per_unit']
                },
                {
                    model: Product,
                    as: 'product',
                    attributes: ['id', 'name', 'cost_price', 'price']
                },
                {
                    model: Warehouse,
                    as: 'warehouse',
                    attributes: ['id', 'name']
                }
            ],
            order: [['transaction_date', 'ASC']]
        });

        // Aggregate in memory
        const stockMap = {}; // Key: warehouseId_productId

        transactions.forEach(trx => {
            const key = `${trx.warehouse_id}_${trx.product_id}`;
            if (!stockMap[key]) {
                const product = trx.product;
                const warehouse = trx.warehouse;
                stockMap[key] = {
                    id: key, // Dummy ID
                    product: product,
                    warehouse: warehouse,
                    quantity: 0,
                    value: 0
                };
            }

            const sign = trx.transaction_type === 'in' ? 1 : -1;

            if (trx.transaction_batches && trx.transaction_batches.length > 0) {
                trx.transaction_batches.forEach(batch => {
                    const qty = parseFloat(batch.quantity || 0);
                    const cost = parseFloat(batch.cost_per_unit || 0); // Historical Cost

                    stockMap[key].quantity += qty * sign;
                    // For value, we ideally track FIFO layers, but for a simple report, 
                    // using the batch cost at transaction time is a good approximation for 'in', 
                    // but for 'out' it removes value.
                    // A simple approximation: Value += Qty * Cost * Sign
                    stockMap[key].value += qty * cost * sign;
                });
            } else {
                // Fallback if no batches (shouldn't happen in batch system, but for safety)
                const qty = parseFloat(trx.quantity || 0);
                const cost = parseFloat(trx.product?.cost_price || 0); // Current cost fallback
                stockMap[key].quantity += qty * sign;
                stockMap[key].value += qty * cost * sign;
            }
        });

        // Convert map to list and filter out zero quantities
        inventory = Object.values(stockMap).filter(item => item.quantity > 0.001); // Filter near-zero floating points

    } else {
        // --- Current Snapshot Mode (Fast) ---
        const currentInv = await CurrentInventory.findAll({
            include: [
                {
                    model: Product,
                    as: 'product',
                    attributes: ['name', 'cost_price', 'price']
                },
                {
                    model: Warehouse,
                    as: 'warehouse',
                    attributes: ['name']
                }
            ]
        });

        // Map to standard format
        inventory = currentInv.map(item => ({
            id: item.id,
            product: item.product,
            warehouse: item.warehouse,
            quantity: parseFloat(item.quantity || 0),
            // For current inventory, value = Qty * Current Standard Cost
            value: parseFloat(item.quantity || 0) * parseFloat(item.product?.cost_price || 0)
        }));
    }

    // --- Common Aggregation Logic ---
    let totalStockValue = 0;
    let totalItems = 0;
    const warehouseStats = {};
    const lowStockItems = [];

    inventory.forEach(item => {
        const qty = item.quantity;
        const value = item.value; // Pre-calculated above

        totalStockValue += value;
        totalItems += qty;

        // Warehouse stats
        const warehouseName = item.warehouse?.name || 'Unknown';
        if (!warehouseStats[warehouseName]) {
            warehouseStats[warehouseName] = 0;
        }
        warehouseStats[warehouseName] += value;

        // Low stock check
        if (qty < 10) {
            lowStockItems.push({
                product: item.product?.name,
                warehouse: warehouseName,
                quantity: qty
            });
        }
    });

    // Chart Data (Warehouse Values)
    const warehouseChart = Object.keys(warehouseStats).map(name => ({
        name,
        value: warehouseStats[name]
    })).sort((a, b) => b.value - a.value);

    // Detailed list for table
    const detailedList = inventory.map(item => ({
        id: item.id || `${item.warehouse?.id}_${item.product?.id}`,
        product: item.product?.name,
        warehouse: item.warehouse?.name,
        quantity: item.quantity.toFixed(2),
        cost_price: item.product?.cost_price, // Display current cost reference
        total_value: item.value.toFixed(2)
    }));

    return {
        summary: {
            totalStockValue,
            totalItems,
            lowStockCount: lowStockItems.length
        },
        warehouseChart,
        lowStockItems,
        detailedList
    };
};

export default {
    getDashboardSummary,
    getTopSellingProducts,
    getLowStockItems,
    getSalesReport,
    getPurchasesReport,
    getExpensesReport,
    getJobOrdersReport,
    getWarehouseReport,
    getIssueVouchersReport
};
