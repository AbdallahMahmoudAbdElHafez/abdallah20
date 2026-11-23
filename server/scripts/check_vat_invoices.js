import { sequelize } from '../src/models/index.js';

async function checkEntryTypes() {
    try {
        const [entryTypes] = await sequelize.query("SELECT * FROM entry_types");
        console.log('Entry Types:', entryTypes);

        const [refTypes] = await sequelize.query("SELECT id, code, label FROM reference_types WHERE code IN ('sales_vat_cancellation', 'manual_entry', 'settlement', 'sales_invoice')");
        console.log('Ref Types:', refTypes);

        process.exit(0);
    } catch(e) {
        console.error(e);
        process.exit(1);
    }
}
checkEntryTypes();
