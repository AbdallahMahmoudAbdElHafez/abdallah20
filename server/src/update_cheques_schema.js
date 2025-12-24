import { sequelize } from './models/index.js';
import ChequeModel from './models/cheque.model.js';

async function updateSchema() {
    try {
        const Cheque = ChequeModel(sequelize);
        console.log('Syncing Cheque model...');
        await Cheque.sync({ alter: true });
        console.log('Cheque model synced successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Error syncing model:', error);
        process.exit(1);
    }
}

updateSchema();
