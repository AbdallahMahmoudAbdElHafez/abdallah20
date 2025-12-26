import {
    SalesInvoice,
    SalesInvoiceItem,
    PurchaseInvoice,
    PurchaseInvoiceItem,
    Expense,
    ExternalJobOrder,
    Product,
    CurrentInventory,
    Party,
    Employee,
    Warehouse,
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
        where: startDate || endDate ? { invoice_date: dateFilter.date } : {}
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
            [sequelize.literal('SUM(sales_invoice_items.quantity * sales_invoice_items.price)'), 'total_revenue']
        ],
        include: [
            {
                model: SalesInvoice,
                as: 'sales_invoice',
                attributes: [],
                where: startDate || endDate ? dateFilter : {}
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

    const sales = await SalesInvoice.findAll({
        where: dateFilter,
        include: [
            {
                model: Party,
                as: 'party',
                attributes: ['id', 'name']
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
                include: [{
                    model: Product,
                    as: 'product',
                    attributes: ['name']
                }]
            }
        ],
        order: [['invoice_date', 'DESC']]
    });

    // Calculate summary
    const summary = {
        total_invoices: sales.length,
        total_amount: sales.reduce((sum, inv) => sum + parseFloat(inv.total_amount || 0), 0),
        total_tax: sales.reduce((sum, inv) => sum + parseFloat(inv.tax_amount || 0), 0),
        total_discount: sales.reduce((sum, inv) => sum + parseFloat(inv.discount_amount || 0), 0)
    };

    // Group by month for chart
    const chartData = {};
    sales.forEach(sale => {
        const month = sale.invoice_date?.substring(0, 7) || 'Unknown'; // YYYY-MM
        if (!chartData[month]) {
            chartData[month] = 0;
        }
        chartData[month] += parseFloat(sale.total_amount || 0);
    });

    const chartArray = Object.keys(chartData).sort().map(month => ({
        month,
        amount: chartData[month]
    }));

    return {
        data: sales,
        summary,
        chartData: chartArray
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

export default {
    getDashboardSummary,
    getTopSellingProducts,
    getLowStockItems,
    getSalesReport,
    getPurchasesReport,
    getExpensesReport,
    getJobOrdersReport
};
