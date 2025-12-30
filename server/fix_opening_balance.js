
import AccountService from './src/services/account.service.js';
import { sequelize, JournalEntry } from './src/models/index.js';

async function fix() {
    const t = await sequelize.transaction();
    try {
        // 1. Delete the incorrect entry
        const entryId = 25;
        const entry = await JournalEntry.findByPk(entryId, { transaction: t });
        if (entry) {
            console.log(`Deleting incorrect entry #${entryId}...`);
            await entry.destroy({ transaction: t });
        } else {
            console.log(`Entry #${entryId} not found.`);
        }

        await t.commit();
        console.log("Incorrect entry deleted.");

        // 2. Re-trigger the batch posting
        console.log("Triggering re-post of opening balances...");
        const result = await AccountService.postOpeningBalancesBatch(14); // 14 = Retained Earnings

        console.log("Result:", result.message);
        if (result.entry) {
            console.log("New Entry ID:", result.entry.id);
            console.log("Lines created:", result.entry.lines?.length);
        }

        console.log("Fix completed successfully.");
    } catch (err) {
        if (t) await t.rollback();
        console.error("Fix failed:", err);
    } finally {
        process.exit();
    }
}

fix();
