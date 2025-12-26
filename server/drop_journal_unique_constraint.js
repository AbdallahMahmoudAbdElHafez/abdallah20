
import { sequelize } from './src/models/index.js';

async function fixJournalEntriesConstraint() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        // Drop the unique index
        await sequelize.query(`
      ALTER TABLE journal_entries 
      DROP INDEX uq_journal_reference;
    `);

        console.log('Successfully dropped unique index uq_journal_reference');

    } catch (error) {
        if (error.original && error.original.code === 'ER_CANT_DROP_FIELD_OR_KEY') {
            console.log('Index does not exist or already dropped.');
        } else {
            console.error('Error dropping index:', error);
        }
    } finally {
        await sequelize.close();
    }
}

fixJournalEntriesConstraint();
