// src/hooks/externalJobOrderHooks.js
import {
    ExternalJobOrder,
    BillOfMaterial,
    InventoryTransactionBatches,
    Batches,
    Product
} from '../models/index.js';
import InventoryTransactionService from '../services/inventoryTransaction.service.js';
import { sequelize } from '../models/index.js';



export default function externalJobOrderHooks(sequelize) {
    const ExternalJobOrder = sequelize.models.ExternalJobOrder;

    ExternalJobOrder.addHook('afterUpdate', async (jobOrder, options) => {
        // Only proceed if status changed to 'completed'
        if (jobOrder.status !== 'completed' || !jobOrder.changed('status')) {
            return;
        }

        // Check if already processed (has unit_cost)
        if (jobOrder.unit_cost > 0) {
            return; // Already processed
        }

        const transaction = options.transaction || await sequelize.transaction();
        const shouldCommit = !options.transaction;

        try {
            // Validate required fields
            if (!jobOrder.produced_quantity || jobOrder.produced_quantity <= 0) {
                throw new Error('Produced quantity is required and must be greater than 0');
            }

            // Get BOM for the product
            const bom = await BillOfMaterial.findAll({
                where: { product_id: jobOrder.product_id },
                transaction
            });

            if (!bom || bom.length === 0) {
                throw new Error('No Bill of Materials found for this product');
            }

            let totalMaterialCost = 0;
            const materialTransactions = [];

            // Process each material in BOM
            for (const material of bom) {
                const requiredQty = parseFloat(material.quantity_per_unit) * parseFloat(jobOrder.produced_quantity);

                // Get batches using FIFO
                const { batches, remainingNeeded } = await InventoryTransactionService.getBatchesFIFO(
                    material.material_id,
                    jobOrder.warehouse_id,
                    requiredQty,
                    transaction
                );

                if (remainingNeeded > 0) {
                    throw new Error(`Not enough inventory for product ${material.product_id}. Required: ${requiredQty}, Available: ${requiredQty - remainingNeeded}`);
                }

                // Calculate material cost
                const materialCost = batches.reduce((sum, b) => {
                    return sum + (b.quantity * b.cost_per_unit);
                }, 0);
                totalMaterialCost += materialCost;

                // Create "out" transaction for raw material
                await InventoryTransactionService.create({
                    product_id: material.material_id,
                    warehouse_id: jobOrder.warehouse_id,
                    transaction_type: 'out',
                    transaction_date: new Date(),
                    source_type: 'external_job_order',
                    source_id: jobOrder.id,
                    notes: `Material consumption for job order #${jobOrder.id}`,
                    batches: batches
                }, { transaction });
            }

            // Calculate unit cost
            const totalCost = totalMaterialCost + parseFloat(jobOrder.cost_actual || 0);
            const unitCost = totalCost / parseFloat(jobOrder.produced_quantity);

            // Create "in" transaction for finished product
            await InventoryTransactionService.create({
                product_id: jobOrder.product_id,
                warehouse_id: jobOrder.warehouse_id,
                transaction_type: 'in',
                transaction_date: new Date(),
                source_type: 'external_job_order',
                source_id: jobOrder.id,
                notes: `Production completion for job order #${jobOrder.id}`,
                batches: [{
                    quantity: parseFloat(jobOrder.produced_quantity),
                    cost_per_unit: unitCost,
                    batch_number: `PROD-${jobOrder.id}`,
                    expiry_date: null
                }]
            }, { transaction });

            // Update job order with costs
            await jobOrder.update({
                raw_material_cost: totalMaterialCost,
                unit_cost: unitCost
            }, {
                transaction,
                hooks: false // Prevent infinite loop
            });

            if (shouldCommit) {
                await transaction.commit();
            }

            console.log(`✅ Production completed for job order #${jobOrder.id}. Unit cost: ${unitCost}`);

        } catch (error) {
            if (shouldCommit) {
                await transaction.rollback();
            }
            console.error(`❌ Error completing production for job order #${jobOrder.id}:`, error.message);
            throw error;
        }
    });
}
