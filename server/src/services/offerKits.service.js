import { OfferKit, OfferKitItem, Product, sequelize } from '../models/index.js';

class OfferKitsService {
    async getAllOfferKits() {
        return await OfferKit.findAll({
            include: [{
                model: OfferKitItem,
                as: 'items',
                include: [{
                    model: Product,
                    as: 'product',
                    attributes: ['id', 'name', 'price']
                }]
            }],
            order: [['created_at', 'DESC']]
        });
    }

    async getOfferKitById(id) {
        const offerKit = await OfferKit.findByPk(id, {
            include: [{
                model: OfferKitItem,
                as: 'items',
                include: [{
                    model: Product,
                    as: 'product',
                    attributes: ['id', 'name', 'price']
                }]
            }]
        });

        if (!offerKit) {
            throw new Error('Offer Kit not found');
        }

        return offerKit;
    }

    async createOfferKit(data) {
        const t = await sequelize.transaction();

        try {
            const offerKit = await OfferKit.create({
                name: data.name,
                description: data.description,
                active: data.active !== undefined ? data.active : true,
                start_date: data.start_date || null,
                end_date: data.end_date || null
            }, { transaction: t });

            if (data.items && data.items.length > 0) {
                const itemsToCreate = data.items.map(item => ({
                    offer_kit_id: offerKit.id,
                    product_id: item.product_id,
                    quantity: item.quantity || 1,
                    special_price: item.special_price || 0
                }));
                await OfferKitItem.bulkCreate(itemsToCreate, { transaction: t });
            }

            await t.commit();
            return this.getOfferKitById(offerKit.id);
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    async updateOfferKit(id, data) {
        const t = await sequelize.transaction();

        try {
            const offerKit = await OfferKit.findByPk(id);
            if (!offerKit) {
                throw new Error('Offer Kit not found');
            }

            await offerKit.update({
                name: data.name,
                description: data.description,
                active: data.active,
                start_date: data.start_date || null,
                end_date: data.end_date || null,
                updated_at: new Date()
            }, { transaction: t });

            if (data.items) {
                // Remove existing items
                await OfferKitItem.destroy({ where: { offer_kit_id: id }, transaction: t });

                // Add new items
                if (data.items.length > 0) {
                    const itemsToCreate = data.items.map(item => ({
                        offer_kit_id: id,
                        product_id: item.product_id,
                        quantity: item.quantity || 1,
                        special_price: item.special_price || 0
                    }));
                    await OfferKitItem.bulkCreate(itemsToCreate, { transaction: t });
                }
            }

            await t.commit();
            return this.getOfferKitById(id);
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    async deleteOfferKit(id) {
        const offerKit = await OfferKit.findByPk(id);
        if (!offerKit) {
            throw new Error('Offer Kit not found');
        }

        await offerKit.destroy();
        return { message: 'Offer Kit deleted successfully' };
    }
}

export default new OfferKitsService();
