import { sequelize } from './models/index.js';

async function fixSchema() {
    try {
        const queryInterface = sequelize.getQueryInterface();
        const tableName = 'external_job_orders';

        console.log(`Checking columns for table: ${tableName}...`);
        const tableInfo = await queryInterface.describeTable(tableName);

        const columnsToAdd = [
            { name: 'estimated_processing_cost_per_unit', type: 'DECIMAL(12, 2)', defaultValue: 0.0 },
            { name: 'actual_processing_cost_per_unit', type: 'DECIMAL(12, 2)', defaultValue: 0.0 },
            { name: 'estimated_raw_material_cost_per_unit', type: 'DECIMAL(12, 2)', defaultValue: 0.0 },
            { name: 'actual_raw_material_cost_per_unit', type: 'DECIMAL(12, 2)', defaultValue: 0.0 },
            { name: 'total_estimated_cost', type: 'DECIMAL(14, 2)', defaultValue: 0.0 },
            { name: 'total_actual_cost', type: 'DECIMAL(14, 2)', defaultValue: 0.0 },
            { name: 'reference_no', type: 'VARCHAR(100)', allowNull: true },
            { name: 'waste_quantity', type: 'DECIMAL(12, 3)', defaultValue: 0.0 },
            { name: 'transport_cost', type: 'DECIMAL(12, 2)', defaultValue: 0.0 },
        ];

        for (const col of columnsToAdd) {
            if (!tableInfo[col.name]) {
                console.log(`Adding missing column: ${col.name}...`);
                await queryInterface.addColumn(tableName, col.name, {
                    type: col.type,
                    defaultValue: col.defaultValue,
                    allowNull: col.allowNull === undefined ? true : col.allowNull // Default to true if not specified, or use logic
                });
            } else {
                console.log(`Column ${col.name} already exists.`);
            }
        }

        console.log("Schema fix completed successfully.");
        process.exit(0);
    } catch (error) {
        console.error("Error fixing schema:", error);
        process.exit(1);
    }
}

fixSchema();
