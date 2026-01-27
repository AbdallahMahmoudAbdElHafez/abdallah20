import reportsService from './src/services/reports.service.js';

async function testProfitCalculation() {
    try {
        console.log('Testing Profit Calculation Report...');
        const report = await reportsService.getProfitReport('2025-01-01', '2026-12-31');
        console.log('Summary:', JSON.stringify(report.summary, null, 2));
        console.log('Revenue Details Count:', report.details.revenue.length);
        console.log('Direct Expenses Details Count:', report.details.direct_expenses.length);
        console.log('Indirect Expenses Details Count:', report.details.indirect_expenses.length);

        if (report.summary.total_revenue !== undefined && report.summary.net_profit !== undefined) {
            console.log('SUCCESS: Profit calculation report generated successfully.');
        } else {
            console.error('FAILURE: Report summary is missing expected fields.');
        }
        process.exit(0);
    } catch (error) {
        console.error('Error during verification:', error);
        process.exit(1);
    }
}

testProfitCalculation();
