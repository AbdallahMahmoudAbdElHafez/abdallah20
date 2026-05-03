import { sequelize } from './src/models/index.js';

async function syncDB() {
    try {
        console.log("Syncing OfferKit and OfferKitItem models...");
        await sequelize.models.OfferKit.sync({ alter: true });
        await sequelize.models.OfferKitItem.sync({ alter: true });
        console.log("Successfully synced OfferKit models.");
        process.exit(0);
    } catch (error) {
        console.error("Error syncing models:", error);
        process.exit(1);
    }
}

syncDB();
