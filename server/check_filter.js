import { sequelize, JournalEntry } from './src/models/index.js';
import { Op } from 'sequelize';

(async () => {
    try {
        const total = await JournalEntry.count();
        const filtered = await JournalEntry.count({
            where: {
                description: {
                    [Op.and]: [
                        { [Op.notLike]: '%(تم العكس للحذف)%' },
                        { [Op.notLike]: 'قيد عكسي لحذف المرتجع %' }
                    ]
                }
            }
        });
        
        const returnsCancelled = await JournalEntry.count({
            where: {
                description: {
                    [Op.or]: [
                        { [Op.like]: '%(تم العكس للحذف)%' },
                        { [Op.like]: 'قيد عكسي لحذف المرتجع %' }
                    ]
                }
            }
        });
        
        console.log('Total JEs:', total);
        console.log('Filtered JEs:', filtered);
        console.log('Returns Cancelled JEs:', returnsCancelled);
        console.log('JEs with NULL description:', await JournalEntry.count({ where: { description: null } }));
    } catch (e) {
        console.error(e);
    }
    process.exit(0);
})();
