import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('nurivina', 'root', 'Abdallah20203040', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false
});

const requiredAccounts = [
    'المخزون',
    'ضريبة القيمة المضافة',
    'الموردين',
    'خصم مكتسب',
    'خصم و اضافه ضرائب مشتريات',
    'العملاء',
    'مبيعات',
    'تكلفة البضاعة المباعة',
    'خصم مسموح به',
    'خصم خاص',
    'خصم ضرائب مبيعات'
];

(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connected to DB.');

        const accounts = await sequelize.query(
            `SELECT id, name FROM accounts WHERE name IN (:names)`,
            {
                replacements: { names: requiredAccounts },
                type: sequelize.QueryTypes.SELECT
            }
        );

        console.log('--- FOUND ACCOUNTS ---');
        const foundNames = accounts.map(a => a.name);
        accounts.forEach(a => console.log(`✅ Found: "${a.name}" (ID: ${a.id})`));

        console.log('\n--- MISSING ACCOUNTS ---');
        requiredAccounts.forEach(name => {
            if (!foundNames.includes(name)) {
                console.log(`❌ Missing: "${name}"`);
            }
        });

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
})();
