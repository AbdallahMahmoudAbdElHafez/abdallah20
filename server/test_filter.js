import { sequelize, JournalEntryLine, JournalEntry } from './src/models/index.js';
import { Op } from 'sequelize';

(async () => {
    try {
        const linesWithoutFilter = await JournalEntryLine.findAll({
            where: { journal_entry_id: 2110 },
            include: [{
                model: JournalEntry,
                as: 'journal_entry',
                where: {
                    // no filter
                }
            }]
        });
        
        const linesWithFilter = await JournalEntryLine.findAll({
            where: { journal_entry_id: 2110 },
            include: [{
                model: JournalEntry,
                as: 'journal_entry',
                where: {
                    description: {
                        [Op.and]: [
                            { [Op.notLike]: '%(تم العكس للحذف)%' },
                            { [Op.notLike]: 'قيد عكسي لحذف المرتجع %' }
                        ]
                    }
                }
            }]
        });
        
        console.log('Lines without filter:', linesWithoutFilter.length);
        console.log('Lines with filter:', linesWithFilter.length);
    } catch (e) {
        console.error(e);
    }
    process.exit(0);
})();
