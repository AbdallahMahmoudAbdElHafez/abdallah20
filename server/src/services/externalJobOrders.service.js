// src/services/externalJobOrders.service.js
import {
  ExternalJobOrder,
  ExternalJobOrderItem,
  BillOfMaterial,
  Product,
  InventoryTransaction,
  JournalEntry,
  JournalEntryLine,
  sequelize,
  Party,
  Account,
  Warehouse,
  CurrentInventory,
  ServicePayment,
  EntryType
} from "../models/index.js";
import InventoryTransactionService from './inventoryTransaction.service.js';

const ExternalJobOrdersService = {
  getAll: async () => {
    return await ExternalJobOrder.findAll();
  },

  getById: async (id) => {
    return await ExternalJobOrder.findByPk(id);
  },

  create: async (data) => {
    if (data.start_date === '') data.start_date = null;
    if (data.end_date === '') data.end_date = null;
    if (data.estimated_processing_cost_per_unit === '') data.estimated_processing_cost_per_unit = 0;
    if (data.actual_processing_cost_per_unit === '') data.actual_processing_cost_per_unit = 0;
    if (data.estimated_raw_material_cost_per_unit === '') data.estimated_raw_material_cost_per_unit = 0;
    if (data.actual_raw_material_cost_per_unit === '') data.actual_raw_material_cost_per_unit = 0;
    if (data.total_estimated_cost === '') data.total_estimated_cost = 0;
    if (data.total_actual_cost === '') data.total_actual_cost = 0;
    return await ExternalJobOrder.create(data);
  },

  update: async (id, data) => {
    if (data.start_date === '') data.start_date = null;
    if (data.end_date === '') data.end_date = null;
    if (data.estimated_processing_cost_per_unit === '') data.estimated_processing_cost_per_unit = 0;
    if (data.actual_processing_cost_per_unit === '') data.actual_processing_cost_per_unit = 0;
    if (data.estimated_raw_material_cost_per_unit === '') data.estimated_raw_material_cost_per_unit = 0;
    if (data.actual_raw_material_cost_per_unit === '') data.actual_raw_material_cost_per_unit = 0;
    if (data.total_estimated_cost === '') data.total_estimated_cost = 0;
    if (data.total_actual_cost === '') data.total_actual_cost = 0;
    const order = await ExternalJobOrder.findByPk(id);
    if (!order) return null;
    return await order.update(data);
  },

  remove: async (id) => {
    const order = await ExternalJobOrder.findByPk(id);
    if (!order) return null;
    await order.destroy();
    return { message: 'Order deleted successfully' };
  },

  /**
   * Calculate raw material cost based on BOM and Products cost
   * @param {number} productId - Product ID
   * @param {number} warehouseId - Warehouse ID (not used in this calculation)
   * @param {number} orderQuantity - Order quantity
   * @returns {Promise<{raw_material_cost: number, details: Array}>}
   */
  calculateRawMaterialCost: async (productId, warehouseId, orderQuantity) => {
    try {
      // Get BOM for the product
      const bom = await BillOfMaterial.findAll({
        where: { product_id: productId },
        include: [{
          model: Product,
          as: 'material',
          attributes: ['id', 'name', 'cost_price']
        }]
      });

      if (!bom || bom.length === 0) {
        return {
          raw_material_cost: 0,
          details: [],
          message: 'No Bill of Materials found for this product'
        };
      }

      let totalMaterialCost = 0;
      const details = [];

      // Process each material in BOM
      for (const bomItem of bom) {
        const requiredQty = parseFloat(bomItem.quantity_per_unit) * parseFloat(orderQuantity);
        const materialCost = parseFloat(bomItem.material?.cost_price || 0);
        const totalCost = requiredQty * materialCost;

        // Get Available Quantity from CurrentInventory
        const inventory = await CurrentInventory.findOne({
          where: {
            product_id: bomItem.material_id,
            warehouse_id: warehouseId
          }
        });
        const availableQty = inventory ? parseFloat(inventory.quantity) : 0;

        totalMaterialCost += totalCost;

        details.push({
          material_id: bomItem.material_id,
          material_name: bomItem.material?.name,
          quantity_per_unit: parseFloat(bomItem.quantity_per_unit),
          required_quantity: requiredQty,
          available_quantity: availableQty, // Added available quantity
          unit_cost: materialCost,
          total_cost: totalCost
        });
      }

      return {
        raw_material_cost_per_unit: orderQuantity > 0 ? totalMaterialCost / parseFloat(orderQuantity) : 0,
        total_raw_material_cost: totalMaterialCost,
        details: details
      };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Send materials to the manufacturer (Deduct from Inventory)
   */
  sendMaterials: async (jobOrderId, items) => {
    const t = await sequelize.transaction();
    try {
      const order = await ExternalJobOrder.findByPk(jobOrderId, { transaction: t });
      if (!order) throw new Error("Job Order not found");

      let totalMaterialCost = 0;

      for (const item of items) {
        const product = await Product.findByPk(item.product_id, { transaction: t });
        const cost = Number(product.cost_price || 0);

        // 1. Inventory Transaction (OUT)
        // Try to allocate batches (FIFO)
        const { batches, remainingNeeded } = await InventoryTransactionService.getBatchesFIFO(
          item.product_id,
          item.warehouse_id,
          Number(item.quantity),
          t
        );

        if (batches && batches.length > 0 && remainingNeeded > 0.001) {
          throw new Error(`Not enough batched inventory for product ${item.product_id}. Required: ${item.quantity}, Available in batches: ${item.quantity - remainingNeeded}`);
        }

        const transactionData = {
          product_id: item.product_id,
          warehouse_id: item.warehouse_id,
          transaction_type: 'out',
          quantity: item.quantity,
          transaction_date: new Date(),
          source_type: 'external_job_order',
          source_id: jobOrderId,
          notes: `Material issue for Job Order #${jobOrderId}`,
          batches: batches && batches.length > 0 ? batches : [{
            batch_id: null,
            quantity: item.quantity,
            cost_per_unit: cost
          }]
        };

        await InventoryTransactionService.create(transactionData, { transaction: t });

        // 2. Create Job Order Items (One row per batch if available)
        if (batches && batches.length > 0) {
          for (const batch of batches) {
            const batchCost = Number(batch.cost_per_unit || cost);
            const lineCost = Number(batch.quantity) * batchCost;
            await ExternalJobOrderItem.create({
              job_order_id: jobOrderId,
              product_id: item.product_id,
              warehouse_id: item.warehouse_id,
              quantity_sent: batch.quantity,
              unit_cost: batchCost,
              total_cost: lineCost,
              batch_id: batch.batch_id
            }, { transaction: t });
            totalMaterialCost += lineCost;
          }
        } else {
          const lineCost = Number(item.quantity) * cost;
          await ExternalJobOrderItem.create({
            job_order_id: jobOrderId,
            product_id: item.product_id,
            warehouse_id: item.warehouse_id,
            quantity_sent: item.quantity,
            unit_cost: cost,
            total_cost: lineCost,
            batch_id: null
          }, { transaction: t });
          totalMaterialCost += lineCost;
        }
      }

      // 3. Create Journal Entry (Issue Materials)
      // Debit WIP (109), Credit Raw Materials (49)
      const wipAccountId = 109;
      const rmInvAccountId = 49;

      if (totalMaterialCost > 0) {
        const je = await JournalEntry.create({
          entry_type_id: 13, // Production/Manufacturing
          reference_type_id: 1, // JobOrder
          reference_id: jobOrderId,
          date: new Date(),
          description: `صرف خامات لأمر تشغيل خارجي #${jobOrderId}`,
          status: 'posted'
        }, { transaction: t });

        await JournalEntryLine.bulkCreate([
          {
            journal_entry_id: je.id,
            account_id: wipAccountId,
            debit: totalMaterialCost,
            credit: 0,
            description: `منصرف خامات ومستلزمات - أمر #${jobOrderId}`
          },
          {
            journal_entry_id: je.id,
            account_id: rmInvAccountId,
            debit: 0,
            credit: totalMaterialCost,
            description: `منصرف خامات ومستلزمات - أمر #${jobOrderId}`
          }
        ], { transaction: t });
      }

      // 4. Update Order Status
      // Update raw_material_cost on the order
      await order.update({
        status: 'in_progress',
        raw_material_cost: Number(order.raw_material_cost || 0) + totalMaterialCost
      }, { transaction: t });

      await t.commit();
      return { success: true, totalMaterialCost };
    } catch (error) {
      await t.rollback();
      throw error;
    }
  },

  /**
   * Receive Finished Goods
   */
  receiveFinishedGoods: async (jobOrderId, data) => {
    const t = await sequelize.transaction();
    try {
      const order = await ExternalJobOrder.findByPk(jobOrderId, {
        include: [{ model: Party, as: 'party' }],
        transaction: t
      });
      if (!order) throw new Error("Job Order not found");

      // 1. Calculate Costs
      const materials = await ExternalJobOrderItem.findAll({
        where: { job_order_id: jobOrderId },
        transaction: t
      });

      const totalMaterialCost = materials.reduce((sum, item) => sum + Number(item.total_cost), 0);
      const serviceCost = Number(data.service_cost || 0);
      const transportCost = Number(data.transport_cost || 0);
      const totalCost = totalMaterialCost + serviceCost + transportCost;

      const producedQty = Number(data.produced_quantity);
      const unitCost = producedQty > 0 ? totalCost / producedQty : 0;

      // 2. Update Product Cost
      const product = await Product.findByPk(order.product_id, { transaction: t });
      await product.update({ cost_price: unitCost }, { transaction: t });

      // 3. Inventory Transaction (IN) - Finished Good (Using Service to create Batches)
      await InventoryTransactionService.create({
        product_id: order.product_id,
        warehouse_id: order.warehouse_id, // Target warehouse
        transaction_type: 'in',
        quantity: producedQty, // Used for validation/current inventory
        transaction_date: new Date(),
        source_type: 'external_job_order',
        source_id: jobOrderId,
        notes: `External Job Order #${jobOrderId} - Finished Goods Received`,
        batches: [{
          quantity: producedQty,
          batch_number: data.batch_number || `PROD-${jobOrderId}`,
          expiry_date: data.expiry_date || null,
          cost_per_unit: unitCost // Explicitly pass the correct cost
        }]
      }, { transaction: t });

      // 4. Journal Entry
      // Accounts
      const rmInvAccountId = 49; // المخزون (Raw Materials)
      const wipAccountId = 109; // تحت التشغيل (WIP)
      const fgInvAccountId = 110; // مخزون تام الصنع (Finished Goods)

      const supplierAccountId = order.party?.account_id;
      if (!supplierAccountId) throw new Error("Supplier does not have a linked account");

      const je = await JournalEntry.create({
        entry_type_id: 13, // Production/Manufacturing
        reference_type_id: 1, // JobOrder
        reference_id: jobOrderId,
        date: new Date(),
        description: `تسويات إنتاج تام - أمر تشغيل #${jobOrderId} (خامات + تشغيل + نقل)`,
        status: 'posted'
      }, { transaction: t });

      const jeLines = [];

      // 1. (REMOVED) Issue Materials to WIP 
      // This is now done in 'sendMaterials' step to reflect accurate timing.

      // 2. Load Service Cost to WIP (Debit WIP, Credit Supplier)
      if (serviceCost > 0) {
        jeLines.push({
          journal_entry_id: je.id,
          account_id: wipAccountId,
          debit: serviceCost,
          credit: 0,
          description: `تحميل تكلفة تشغيل خارجي - أمر #${jobOrderId}`
        });
        jeLines.push({
          journal_entry_id: je.id,
          account_id: supplierAccountId,
          debit: 0,
          credit: serviceCost,
          description: `استحقاق تشغيل خارجي - أمر #${jobOrderId}`
        });
      }

      // 3. Load Transport Cost to WIP (Debit WIP, Credit Supplier/Cash)
      if (transportCost > 0) {
        jeLines.push({
          journal_entry_id: je.id,
          account_id: wipAccountId,
          debit: transportCost,
          credit: 0,
          description: `تحميل تكلفة نقل - أمر #${jobOrderId}`
        });
        // Assuming paid by Supplier or added to Supplier account as requested ("Credit Suppliers...").
        // If Cash is needed, logic would differ, but defaulting to Supplier matches the context of outsourcing liabilities.
        jeLines.push({
          journal_entry_id: je.id,
          account_id: supplierAccountId,
          debit: 0,
          credit: transportCost,
          description: `استحقاق نقل - أمر #${jobOrderId}`
        });
      }

      // 4. Close WIP to Finished Goods (Debit FG Inv, Credit WIP)
      if (totalCost > 0) {
        jeLines.push({
          journal_entry_id: je.id,
          account_id: fgInvAccountId,
          debit: totalCost,
          credit: 0,
          description: `استلام منتج تام - أمر #${jobOrderId}`
        });
        jeLines.push({
          journal_entry_id: je.id,
          account_id: wipAccountId,
          debit: 0,
          credit: totalCost,
          description: `إقفال تحت التشغيل - أمر #${jobOrderId}`
        });
      }

      await JournalEntryLine.bulkCreate(jeLines, { transaction: t });

      // 5. Update Order
      await order.update({
        status: 'completed',
        produced_quantity: producedQty,
        waste_quantity: data.waste_quantity,
        actual_processing_cost_per_unit: serviceCost / producedQty,
        actual_raw_material_cost_per_unit: totalMaterialCost / producedQty,
        total_actual_cost: totalCost,
        transport_cost: transportCost
      }, {
        transaction: t,
        hooks: false // Disable hooks to prevent duplicate InventoryTransaction from externalJobOrderHooks.js
      });

      await t.commit();
      return { success: true, totalCost, unitCost };

    } catch (error) {
      await t.rollback();
      throw error;
    }
  }
};

export default ExternalJobOrdersService;
