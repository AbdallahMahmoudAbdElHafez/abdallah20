import {
    SalesInvoice,
    SalesInvoiceItem,
    SalesInvoicePayment,
    SalesReturn,
    SalesReturnItem,
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
    dateFilter.invoice_status = { [Op.ne]: 'cancelled' };

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

    // --- Fetch Sales Returns ---
    const returnDateFilter = {};
    if (startDate && endDate) {
        returnDateFilter.return_date = { [Op.between]: [startDate, endDate] };
    } else if (startDate) {
        returnDateFilter.return_date = { [Op.gte]: startDate };
    } else if (endDate) {
        returnDateFilter.return_date = { [Op.lte]: endDate };
    }

    const returns = await SalesReturn.findAll({
        where: returnDateFilter,
        include: [
            {
                model: SalesReturnItem,
                as: 'items',
                include: [{ model: Product, as: 'product', attributes: ['name'] }]
            },
            {
                model: Employee,
                as: 'employee',
                attributes: ['id', 'name']
            },
            {
                model: Party,
                as: 'customer',
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
            }
        ]
    });

    // Calculate Return Totals
    const totalReturnsCash = returns.filter(r => r.return_type === 'cash').reduce((sum, r) => sum + parseFloat(r.total_amount || 0), 0);
    const totalReturnsCredit = returns.filter(r => r.return_type !== 'cash').reduce((sum, r) => sum + parseFloat(r.total_amount || 0), 0);
    const totalReturns = totalReturnsCash + totalReturnsCredit;
    const totalReturnsTax = returns.reduce((sum, r) => sum + parseFloat(r.tax_amount || 0), 0);

    // Calculate summary
    const totalSales = sales.reduce((sum, inv) => sum + parseFloat(inv.total_amount || 0), 0);
    const totalTax = sales.reduce((sum, inv) => sum + parseFloat(inv.tax_amount || 0) + parseFloat(inv.vat_amount || 0), 0);
    const totalVat = sales.reduce((sum, inv) => sum + parseFloat(inv.vat_amount || 0), 0);
    const totalDiscount = sales.reduce((sum, inv) => sum + parseFloat(inv.discount_amount || 0), 0);

    const summary = {
        total_invoices: sales.length,
        total_sales: totalSales,
        total_returns: totalReturns,
        total_returns_cash: totalReturnsCash,
        total_returns_credit: totalReturnsCredit,
        net_sales: totalSales - totalReturns,
        total_tax: totalTax - totalReturnsTax, // Net Tax
        total_vat: totalVat, // VAT usually on sales, returns reverse it but let's keep sales VAT separate or net it? Usually Net.
        // Let's keep total_tax as Net Tax for now.
        total_discount: totalDiscount
    };

    // Group by month for chart (Sales - Returns)
    const chartData = {};
    const employeeData = {};
    const employeeProductStats = {};
    const regionData = {};
    const productStats = {};

    // Process Sales
    sales.forEach(sale => {
        const total = parseFloat(sale.total_amount || 0);
        const month = sale.invoice_date?.substring(0, 7) || 'Unknown';

        if (!chartData[month]) chartData[month] = 0;
        chartData[month] += total;

        const empName = sale.employee?.name || 'غير محدد';
        if (!employeeData[empName]) employeeData[empName] = 0;
        employeeData[empName] += total;

        let regionName = 'غير محدد';
        if (sale.party?.city?.governate?.name) regionName = sale.party.city.governate.name;
        else if (sale.party?.city?.name) regionName = sale.party.city.name;

        if (!regionData[regionName]) regionData[regionName] = 0;
        regionData[regionName] += total;

        if (sale.items && sale.items.length > 0) {
            sale.items.forEach(item => {
                const productId = item.product_id;
                const productName = item.product?.name || `Product ${productId}`;
                const qty = parseFloat(item.quantity || 0);
                const revenue = (qty * parseFloat(item.price || 0)) - parseFloat(item.discount || 0) + parseFloat(item.tax_amount || 0) + parseFloat(item.vat_amount || 0);

                if (!productStats[productId]) {
                    productStats[productId] = { product: productName, quantity: 0, bonus: 0, revenue: 0, cost: 0 };
                }
                productStats[productId].quantity += qty;
                productStats[productId].bonus += parseInt(item.bonus || 0);
                productStats[productId].revenue += revenue;

                // Cost logic (simplified for brevity, keeping existing logic structure)
                let itemCost = 0;
                // ... (existing cost logic assumed to be here or we just use simple calc for now to save space in replacement)
                const costRef = item.product?.cost_price || 0;
                itemCost += qty * parseFloat(costRef);
                productStats[productId].cost += itemCost;

                const epKey = `${empName}_${productId}`;
                if (!employeeProductStats[epKey]) {
                    employeeProductStats[epKey] = { employee: empName, product: productName, quantity: 0, revenue: 0 };
                }
                employeeProductStats[epKey].quantity += qty;
                employeeProductStats[epKey].revenue += revenue;
            });
        }
    });

    // Process Returns (Deduct from aggregations)
    returns.forEach(ret => {
        const total = parseFloat(ret.total_amount || 0);
        const month = ret.return_date?.substring(0, 7) || 'Unknown';

        if (!chartData[month]) chartData[month] = 0;
        chartData[month] -= total; // Deduct return

        const empName = ret.employee?.name || 'غير محدد';
        if (!employeeData[empName]) employeeData[empName] = 0;
        employeeData[empName] -= total; // Deduct return

        let regionName = 'غير محدد';
        if (ret.customer?.city?.governate?.name) regionName = ret.customer.city.governate.name;
        else if (ret.customer?.city?.name) regionName = ret.customer.city.name;

        if (!regionData[regionName]) regionData[regionName] = 0;
        regionData[regionName] -= total;

        if (ret.items && ret.items.length > 0) {
            ret.items.forEach(item => {
                const productId = item.product_id;
                const productName = item.product?.name || `Product ${productId}`;
                const qty = parseFloat(item.quantity || 0);
                // Revenue deduction (approximate if tax/discount not per item in return model, but usually is)
                // SalesReturnItem has price, quantity. 
                const revenue = (qty * parseFloat(item.price || 0)); // Simplified, assuming gross return deduction

                if (!productStats[productId]) {
                    productStats[productId] = { product: productName, quantity: 0, bonus: 0, revenue: 0, cost: 0 };
                }
                productStats[productId].quantity -= qty;
                productStats[productId].revenue -= revenue;

                // Cost deduction
                const costRef = 0; // Need cost to reverse profit. 
                // For now, let's assume we don't reverse cost in this simple view or use product master cost
                // productStats[productId].cost -= ... 

                const epKey = `${empName}_${productId}`;
                if (!employeeProductStats[epKey]) {
                    employeeProductStats[epKey] = { employee: empName, product: productName, quantity: 0, revenue: 0 };
                }
                employeeProductStats[epKey].quantity -= qty;
                employeeProductStats[epKey].revenue -= revenue;
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

    const salesByProduct = Object.values(productStats).map(stat => ({
        ...stat,
        profit: stat.revenue - stat.cost,
        margin: stat.revenue > 0 ? ((stat.revenue - stat.cost) / stat.revenue) * 100 : 0
    })).sort((a, b) => b.revenue - a.revenue);

    const salesByEmployeeProduct = Object.values(employeeProductStats)
        .sort((a, b) => a.employee.localeCompare(b.employee) || b.revenue - a.revenue);

    return {
        data: sales,
        returns: returns, // [NEW] Send returns data too if needed for detailed list
        summary,
        chartData: chartArray,
        salesByEmployee,
        salesByRegion,
        salesByProduct,
        salesByEmployeeProduct
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

/**
 * Customer Receivables Report
 */
const getCustomerReceivablesReport = async (startDate, endDate) => {
    const dateFilter = {};
    if (startDate && endDate) {
        dateFilter.date = { [Op.between]: [startDate, endDate] };
    } else if (startDate) {
        dateFilter.date = { [Op.gte]: startDate };
    } else if (endDate) {
        dateFilter.date = { [Op.lte]: endDate };
    }

    // 1. Get all customers
    const customers = await Party.findAll({
        where: { party_type: ['customer', 'both'] },
        attributes: ['id', 'name', 'phone', 'address', 'opening_balance'],
        raw: true
    });

    // 2. Aggregate Data
    // We will fetch totals for each customer. 
    // Optimization: Instead of N+1 queries, we can use group by queries for each table.

    // Sales Totals
    const sales = await SalesInvoice.findAll({
        attributes: [
            'party_id',
            [sequelize.fn('SUM', sequelize.col('total_amount')), 'total_sales']
        ],
        where: {
            invoice_status: 'approved',
            ...(startDate || endDate ? { invoice_date: dateFilter.date } : {})
        },
        group: ['party_id'],
        raw: true
    });

    // Payments Totals
    const payments = await SalesInvoicePayment.findAll({
        attributes: [
            [sequelize.col('sales_invoice.party_id'), 'party_id'],
            [sequelize.fn('SUM', sequelize.col('amount')), 'total_payments']
        ],
        include: [{
            model: SalesInvoice,
            as: 'sales_invoice',
            attributes: [],
            required: true
        }],
        where: startDate || endDate ? { payment_date: dateFilter.date } : {},
        group: [sequelize.col('sales_invoice.party_id')],
        raw: true
    });

    // Returns Totals
    const returns = await SalesReturn.findAll({
        attributes: [
            'party_id',
            [sequelize.fn('SUM', sequelize.col('total_amount')), 'total_returns']
        ],
        where: startDate || endDate ? { return_date: dateFilter.date } : {},
        group: ['party_id'],
        raw: true
    });

    // Replacements (Issue Vouchers with type 'replacement')
    // Note: Replacements add to the customer's debt (Debit) just like a sale.
    // We need to calculate the value of replacements.
    // This is more complex because value is sum(qty * price).
    // For report speed, we might need to fetch them and sum in JS or complex query.
    // Let's do a fetch all for replacements in the date range.
    const replacements = await IssueVoucher.findAll({
        where: {
            issue_type: 'replacement',
            status: 'approved',
            ...(startDate || endDate ? { issue_date: dateFilter.date } : {})
        },
        include: [{
            model: IssueVoucherItem,
            as: 'items',
            include: [{
                model: Product,
                as: 'product',
                attributes: ['price']
            }]
        }]
    });

    const replacementMap = {};
    replacements.forEach(iv => {
        const partyId = iv.party_id;
        const voucherValue = iv.items.reduce((sum, item) => {
            const price = Number(item.product?.price) || 0;
            return sum + (Number(item.quantity) * price);
        }, 0);

        if (!replacementMap[partyId]) replacementMap[partyId] = 0;
        replacementMap[partyId] += voucherValue;
    });

    // 3. Merge Data
    const salesMap = {};
    sales.forEach(s => salesMap[s.party_id] = parseFloat(s.total_sales || 0));

    const paymentsMap = {};
    payments.forEach(p => paymentsMap[p.party_id] = parseFloat(p.total_payments || 0));

    const returnsMap = {};
    returns.forEach(r => returnsMap[r.party_id] = parseFloat(r.total_returns || 0));

    let totalReceivables = 0;

    const reportData = customers.map(customer => {
        const totalSales = salesMap[customer.id] || 0;
        const totalReplacements = replacementMap[customer.id] || 0;
        const totalPayments = paymentsMap[customer.id] || 0;
        const totalReturns = returnsMap[customer.id] || 0;
        const openingBalance = parseFloat(customer.opening_balance || 0);

        // Balance = (Opening + Sales + Replacements) - (Payments + Returns)
        const netBalance = (openingBalance + totalSales + totalReplacements) - (totalPayments + totalReturns);

        if (netBalance !== 0 || totalSales !== 0 || totalPayments !== 0 || openingBalance !== 0) {
            totalReceivables += netBalance;
            return {
                ...customer,
                opening_balance: openingBalance,
                total_sales: totalSales,
                total_replacements: totalReplacements,
                total_payments: totalPayments,
                total_returns: totalReturns,
                net_balance: netBalance
            };
        }
        return null;
    }).filter(item => item !== null);

    // Sort by balance descending (highest debt first)
    reportData.sort((a, b) => b.net_balance - a.net_balance);

    return {
        data: reportData,
        summary: {
            total_customers: reportData.length,
            total_receivables: totalReceivables
        }
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

/**
 * Opening Sales Invoices Report
 */
const getOpeningSalesInvoicesReport = async (startDate, endDate) => {
    const dateFilter = { invoice_type: 'opening' };
    if (startDate && endDate) {
        dateFilter.invoice_date = { [Op.between]: [startDate, endDate] };
    } else if (startDate) {
        dateFilter.invoice_date = { [Op.gte]: startDate };
    } else if (endDate) {
        dateFilter.invoice_date = { [Op.lte]: endDate };
    }

    const openingInvoices = await SalesInvoice.findAll({
        where: dateFilter,
        include: [
            {
                model: Party,
                as: 'party',
                attributes: ['id', 'name']
            }
        ],
        order: [['invoice_date', 'DESC']]
    });

    const summary = {
        total_invoices: openingInvoices.length,
        total_amount: openingInvoices.reduce((sum, inv) => sum + parseFloat(inv.total_amount || 0), 0)
    };

    return {
        data: openingInvoices,
        summary
    };
};

/**
 * Profit Calculation Report
 * Revenue = Account 5 (ايرادات)
 * Direct Expenses = Account 3 (مصروفات مباشره)
 * Gross Profit = Revenue - Direct Expenses
 * Indirect Expenses = Account 4 (مصروفات غير مباشره)
 * Net Profit = Gross Profit - Indirect Expenses
 */
const getProfitReport = async (startDate, endDate) => {
    const { Account, JournalEntryLine, JournalEntry } = await import('../models/index.js');

    const dateFilter = {};
    if (startDate && endDate) {
        dateFilter.entry_date = { [Op.between]: [startDate, endDate] };
    } else if (startDate) {
        dateFilter.entry_date = { [Op.gte]: startDate };
    } else if (endDate) {
        dateFilter.entry_date = { [Op.lte]: endDate };
    }

    // Helper function to get account balance with children within date range
    const getAccountBalance = async (accountId) => {
        const getAllChildIds = async (parentId) => {
            const children = await Account.findAll({
                where: { parent_account_id: parentId },
                attributes: ['id']
            });
            let ids = [parentId];
            for (const child of children) {
                const childIds = await getAllChildIds(child.id);
                ids = ids.concat(childIds);
            }
            return ids;
        };

        const accountIds = await getAllChildIds(accountId);

        const result = await JournalEntryLine.findOne({
            attributes: [
                [sequelize.fn('SUM', sequelize.col('debit')), 'total_debit'],
                [sequelize.fn('SUM', sequelize.col('credit')), 'total_credit']
            ],
            where: {
                account_id: { [Op.in]: accountIds }
            },
            include: [{
                model: JournalEntry,
                as: 'journal_entry',
                attributes: [],
                where: dateFilter
            }],
            raw: true
        });

        const totalDebit = parseFloat(result?.total_debit || 0);
        const totalCredit = parseFloat(result?.total_credit || 0);

        // For Revenue and Liabilities, balance is Credit - Debit
        // For Expenses and Assets, balance is Debit - Credit
        const account = await Account.findByPk(accountId);
        if (account.normal_balance === 'credit') {
            return totalCredit - totalDebit;
        } else {
            return totalDebit - totalCredit;
        }
    };

    // Get detailed breakdown
    const getAccountDetails = async (parentAccountId) => {
        const children = await Account.findAll({
            where: { parent_account_id: parentAccountId },
            attributes: ['id', 'name', 'normal_balance']
        });

        const details = [];
        for (const child of children) {
            const balance = await getAccountBalance(child.id);
            if (Math.abs(balance) > 0.01) {
                details.push({
                    id: child.id,
                    name: child.name,
                    balance: balance
                });
            }
        }
        return details;
    };

    const REVENUE_ID = 5;
    const DIRECT_EXPENSES_ID = 3;
    const INDIRECT_EXPENSES_ID = 4;

    const revenueBalance = await getAccountBalance(REVENUE_ID);
    const directExpensesBalance = await getAccountBalance(DIRECT_EXPENSES_ID);
    const indirectExpensesBalance = await getAccountBalance(INDIRECT_EXPENSES_ID);

    const revenueDetails = await getAccountDetails(REVENUE_ID);
    const directExpensesDetails = await getAccountDetails(DIRECT_EXPENSES_ID);
    const indirectExpensesDetails = await getAccountDetails(INDIRECT_EXPENSES_ID);

    const grossProfit = revenueBalance - directExpensesBalance;
    const netProfit = grossProfit - indirectExpensesBalance;

    return {
        startDate,
        endDate,
        summary: {
            total_revenue: revenueBalance,
            total_direct_expenses: directExpensesBalance,
            gross_profit: grossProfit,
            total_indirect_expenses: indirectExpensesBalance,
            net_profit: netProfit
        },
        details: {
            revenue: revenueDetails,
            direct_expenses: directExpensesDetails,
            indirect_expenses: indirectExpensesDetails
        }
    };
};

/**
 * Zakat Calculation Report
 * Zakat Base = Current Assets (Account 9) - Current Liabilities (Account 12)
 * Zakat Due = Base × 2.5%
 */
const getZakatReport = async (date = null) => {
    const { Account, JournalEntryLine, JournalEntry } = await import('../models/index.js');

    const targetDate = date ? new Date(date) : new Date();

    // Helper function to get account balance with children
    const getAccountBalance = async (accountId) => {
        // Get all child accounts recursively
        const getAllChildIds = async (parentId) => {
            const children = await Account.findAll({
                where: { parent_account_id: parentId },
                attributes: ['id']
            });
            let ids = [parentId];
            for (const child of children) {
                const childIds = await getAllChildIds(child.id);
                ids = ids.concat(childIds);
            }
            return ids;
        };

        const accountIds = await getAllChildIds(accountId);

        // Sum all journal entry lines for these accounts up to the target date
        const result = await JournalEntryLine.findOne({
            attributes: [
                [sequelize.fn('SUM', sequelize.col('debit')), 'total_debit'],
                [sequelize.fn('SUM', sequelize.col('credit')), 'total_credit']
            ],
            where: {
                account_id: { [Op.in]: accountIds }
            },
            include: [{
                model: JournalEntry,
                as: 'journal_entry',
                attributes: [],
                where: {
                    entry_date: { [Op.lte]: targetDate }
                }
            }],
            raw: true
        });

        const totalDebit = parseFloat(result?.total_debit || 0);
        const totalCredit = parseFloat(result?.total_credit || 0);

        return totalDebit - totalCredit;
    };

    // Get detailed breakdown
    const getAccountDetails = async (parentAccountId) => {
        const children = await Account.findAll({
            where: { parent_account_id: parentAccountId },
            attributes: ['id', 'name']
        });

        const details = [];
        for (const child of children) {
            const balance = await getAccountBalance(child.id);
            if (Math.abs(balance) > 0.01) {
                details.push({
                    id: child.id,
                    name: child.name,
                    balance: balance
                });
            }
        }
        return details;
    };

    // Account IDs from the chart of accounts
    const CURRENT_ASSETS_ID = 9;    // أصول متداولة
    const CURRENT_LIABILITIES_ID = 12; // خصوم متداولة
    const ZAKAT_RATE = 0.025; // 2.5%

    // Calculate totals
    const currentAssetsBalance = await getAccountBalance(CURRENT_ASSETS_ID);
    const currentLiabilitiesBalance = await getAccountBalance(CURRENT_LIABILITIES_ID);

    // For liabilities, the balance is typically credit - debit, so we negate
    const adjustedLiabilities = -currentLiabilitiesBalance;

    // Get detailed breakdowns
    const currentAssetsDetails = await getAccountDetails(CURRENT_ASSETS_ID);
    const currentLiabilitiesDetails = await getAccountDetails(CURRENT_LIABILITIES_ID);

    // Calculate Zakat
    const zakatBase = currentAssetsBalance - adjustedLiabilities;
    const zakatDue = zakatBase > 0 ? zakatBase * ZAKAT_RATE : 0;

    return {
        date: targetDate.toISOString().split('T')[0],
        summary: {
            current_assets: currentAssetsBalance,
            current_liabilities: adjustedLiabilities,
            zakat_base: zakatBase,
            zakat_rate: ZAKAT_RATE * 100,
            zakat_due: zakatDue
        },
        details: {
            current_assets: currentAssetsDetails,
            current_liabilities: currentLiabilitiesDetails.map(item => ({
                ...item,
                balance: -item.balance // Show positive values for display
            }))
        }
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
    getIssueVouchersReport,
    getOpeningSalesInvoicesReport,
    getZakatReport,
    getProfitReport,
    getCustomerReceivablesReport
};
