import { getCustomerStatement } from "../src/services/customerLedger.service.js";

async function run() {
    try {
        const result = await getCustomerStatement(13, {});
        console.log(JSON.stringify(result, null, 2));
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
run();
