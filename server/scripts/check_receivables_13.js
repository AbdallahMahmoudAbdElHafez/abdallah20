import reportsService from "../src/services/reports.service.js";

async function run() {
    try {
        const result = await reportsService.getCustomerReceivablesReport();
        const c13 = result.data.find(c => c.id === 13);
        console.log("Customer 13:", JSON.stringify(c13, null, 2));
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
run();
