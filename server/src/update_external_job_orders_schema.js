import { sequelize } from './models/index.js';

async function updateSchema() {
    try {
        const queryInterface = sequelize.getQueryInterface();

        // 1. Add columns to external_job_orders
        console.log("Checking external_job_orders columns...");
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

        // 2. Create external_job_order_items table
        console.log("Checking external_job_order_items table...");
        // We can use sequelize.sync() for specific models or just createTable
        // Let's use raw SQL for creating the table to be safe and explicit, or define it via createTable

        // Check if table exists
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

        console.log("Schema update completed successfully.");
        process.exit(0);
    } catch (error) {
        console.error("Error updating schema:", error);
        process.exit(1);
    }
}

updateSchema();
