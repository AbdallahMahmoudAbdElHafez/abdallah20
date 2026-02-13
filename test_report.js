import { getIssueVouchersEmployeeSummary } from './server/src/services/reports.service.js';

async function test() {
    try {
        const result = await getIssueVouchersEmployeeSummary('2026-01-01', '2026-12-31');
        console.log('Result count:', result.data.length);
        console.log('Sample data:', JSON.stringify(result.data.slice(0, 2), null, 2));
    } catch (error) {
        console.error('Error:', error);
    }
}

test();
