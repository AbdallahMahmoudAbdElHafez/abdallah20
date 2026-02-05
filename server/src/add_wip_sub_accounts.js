// g:\عبدالله\nurivina\abdallah20\server\src\add_wip_sub_accounts.js
import { Account, sequelize } from './models/index.js';

async function migrate() {
    const t = await sequelize.transaction();
    try {
        console.log("Starting WIP sub-accounts migration...");

        // 1. Check if parent account 109 exists
        const parentAccount = await Account.findByPk(109, { transaction: t });
        if (!parentAccount) {
            throw new Error("Parent WIP account (109) not found. Please check account IDs.");
        }

        console.log(`Found parent: ${parentAccount.name}`);

        // 2. Add "تحت التشغيل - خامات"
        const [materialsAccount, mCreated] = await Account.findOrCreate({
            where: { name: 'تحت التشغيل - خامات', parent_account_id: 109 },
            defaults: {
                account_type: 'asset',
                normal_balance: 'debit',
                opening_balance: 0,
                note: 'حساب فرعي لتتبع تكلفة الخامات تحت التشغيل'
            },
            transaction: t
        });
        console.log(mCreated ? `Created: ${materialsAccount.name} with ID: ${materialsAccount.id}` : `Exists: ${materialsAccount.name} with ID: ${materialsAccount.id}`);

        // 3. Add "تحت التشغيل - خدمات خارجية"
        const [servicesAccount, sCreated] = await Account.findOrCreate({
            where: { name: 'تحت التشغيل - خدمات خارجية', parent_account_id: 109 },
            defaults: {
                account_type: 'asset',
                normal_balance: 'debit',
                opening_balance: 0,
                note: 'حساب فرعي لتتبع تكلفة الخدمات الخارجية تحت التشغيل'
            },
            transaction: t
        });
        console.log(sCreated ? `Created: ${servicesAccount.name} with ID: ${servicesAccount.id}` : `Exists: ${servicesAccount.name} with ID: ${servicesAccount.id}`);

        await t.commit();
        console.log("Migration completed successfully.");
    } catch (error) {
        await t.rollback();
        console.error("Migration failed:", error.message);
        process.exit(1);
    }
}

migrate();
