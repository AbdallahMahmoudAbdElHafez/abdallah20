import { Sequelize } from 'sequelize';
import { env } from './config/env.js';

async function updateSchema() {
    // Connect specifically to 'nurivina_erp'
    const sequelize = new Sequelize('nurivina_erp', env.db.user, env.db.pass, {
        host: env.db.host,
        port: env.db.port,
        dialect: 'mysql',
        logging: console.log,
    });

    try {
        await sequelize.authenticate();
        console.log('Connected to nurivina_erp database.');

        const queryInterface = sequelize.getQueryInterface();

        // 1. Add columns to external_job_orders
        console.log("Checking external_job_orders columns...");
        // We need to wrap in try-catch in case table doesn't exist, though user implies it does
        try {
            const tableInfo = await queryInterface.describeTable('external_job_orders');

            if (!tableInfo.waste_quantity) {
                console.log("Adding waste_quantity column...");
                await queryInterface.addColumn('external_job_orders', 'waste_quantity', {
                    type: 'DECIMAL(12, 3)',
                    defaultValue: 0.0,
                });
            }

            if (!tableInfo.transport_cost) {
                console.log("Adding transport_cost column...");
                await queryInterface.addColumn('external_job_orders', 'transport_cost', {
                    type: 'DECIMAL(12, 2)',
                    defaultValue: 0.0,
                });
            }
        } catch (err) {
            console.error("Error checking external_job_orders (maybe table doesn't exist?):", err.message);
        }

        // 2. Create external_job_order_items table
        console.log("Checking external_job_order_items table...");
        const tables = await queryInterface.showAllTables();
        if (!tables.includes('external_job_order_items')) {
            console.log("Creating external_job_order_items table...");
            await queryInterface.createTable('external_job_order_items', {
                id: {
                    type: 'INTEGER',
                    primaryKey: true,
                    autoIncrement: true,
                    allowNull: false
                },
                job_order_id: {
                    type: 'INTEGER',
                    allowNull: false,
                    references: {
                        model: 'external_job_orders',
                        key: 'id'
                    },
                    onDelete: 'CASCADE'
                },
                product_id: {
                    type: 'INTEGER',
                    allowNull: false
                },
                warehouse_id: {
                    type: 'INTEGER',
                    allowNull: false
                },
                quantity_sent: {
                    type: 'DECIMAL(12, 3)',
                    allowNull: false
                },
                unit_cost: {
                    type: 'DECIMAL(12, 2)',
                    allowNull: false
                },
                total_cost: {
                    type: 'DECIMAL(14, 2)',
                    allowNull: false
                }
            });
        } else {
            console.log("external_job_order_items table already exists.");
        }

        console.log("Schema update for nurivina_erp completed successfully.");
        process.exit(0);
    } catch (error) {
        console.error("Error updating schema:", error);
        process.exit(1);
    }
}

updateSchema();
