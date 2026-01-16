
import {
    IssueVoucher,
    IssueVoucherItem,
    InventoryTransaction,
    InventoryTransactionBatches,
    sequelize
} from './src/models/index.js';
import reportsService from './src/services/reports.service.js';

const runDebug = async () => {
    try {
        console.log('--- Debugging Issue Vouchers Report ---');

        // 1. Check Issue Vouchers
        const vouchers = await IssueVoucher.findAll();
        console.log(`Total Issue Vouchers: ${vouchers.length}`);
        if (vouchers.length > 0) {
            console.log('Sample Voucher:', vouchers[0].toJSON());
        }

        // 2. Check Items of first voucher
        if (vouchers.length > 0) {
            const items = await IssueVoucherItem.findAll({ where: { voucher_id: vouchers[0].id } });
            console.log(`Items in first voucher: ${items.length}`);
            if (items.length > 0) {
                console.log('Sample Item:', items[0].toJSON());

                // 3. Check Association with Transaction
                const item = await IssueVoucherItem.findOne({
                    where: { id: items[0].id },
                    include: [{
                        model: InventoryTransaction,
                        as: 'inventory_transactions'
                    }]
                });
                console.log('Item with Transactions:', JSON.stringify(item.toJSON(), null, 2));

                // Check if transaction exists manually
                const trx = await InventoryTransaction.findAll({
                    where: {
                        source_id: items[0].id,
                        source_type: 'issue_voucher'
                    }
                });
                console.log(`Manual Transaction Check (source_id=${items[0].id}, source_type='issue_voucher'): Found ${trx.length}`);
            }
        }

        // 4. Run Report Service Logic (simulate 2026 data or broad range)
        console.log('--- Running Report Service ---');
        // Use a wide range to ensure we catch data
        const report = await reportsService.getIssueVouchersReport('2020-01-01', '2030-12-31');
        console.log('Report Data Length:', report.data.length);
        console.log('Report Summary:', report.summary);
        if (report.data.length > 0) {
            console.log('First Report Entry:', JSON.stringify(report.data[0], null, 2));
            console.log('Inventory Transactions of first entry item:', report.data[0].items[0]?.inventory_transactions?.length);
        }

    } catch (error) {
        console.error('Debug Error:', error);
    } finally {
        // await sequelize.close(); // Keep connection open if needed or close
        process.exit();
    }
};

runDebug();
