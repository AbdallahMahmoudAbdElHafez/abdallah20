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
  EntryType,
  ReferenceType,
  ExternalJobOrderService,
  JobOrderCostTransaction
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
      const INVENTORY_ACCOUNTS = {
        FINISHED_GOODS: 110,
        RAW_MATERIALS: 111,
        DEFAULT: 49
      };
      const costsByAccount = {};

      for (const item of items) {
        const product = await Product.findByPk(item.product_id, { transaction: t });
        const cost = Number(product.cost_price || 0);
        const typeId = product?.type_id;
        const accountId = typeId === 1 ? INVENTORY_ACCOUNTS.FINISHED_GOODS :
          (typeId === 2 ? INVENTORY_ACCOUNTS.RAW_MATERIALS : INVENTORY_ACCOUNTS.DEFAULT);

        if (!costsByAccount[accountId]) costsByAccount[accountId] = 0;

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
            costsByAccount[accountId] += lineCost;
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
          costsByAccount[accountId] += lineCost;
        }
      }

      // 3. Create Journal Entry (Issue Materials)
      // Credit account depends on product type: 1 -> 110 (Finished Goods), 2 -> 111 (Raw Materials), Else -> 49 (Inventory)
      const wipMaterialsAccount = 127; // WIP - Raw Materials

      if (totalMaterialCost > 0) {
        let refType = await ReferenceType.findOne({ where: { code: 'external_job_order_issue' }, transaction: t });
        if (!refType) {
          refType = await ReferenceType.create({
            code: 'external_job_order_issue',
            label: 'أمر تشغيل خارجي - صرف',
            name: 'أمر تشغيل خارجي - صرف',
            description: 'Journal Entry for External Job Order (Material Issue)'
          }, { transaction: t });
        }

        const je = await JournalEntry.create({
          entry_type_id: 13, // Production/Manufacturing
          reference_type_id: refType.id,
          reference_id: jobOrderId,
          date: new Date(),
          description: `صرف خامات لأمر تشغيل خارجي #${jobOrderId}`,
          status: 'posted'
        }, { transaction: t });

        const lines = [
          {
            journal_entry_id: je.id,
            account_id: wipMaterialsAccount,
            debit: totalMaterialCost,
            credit: 0,
            description: `منصرف خامات ومستلزمات - أمر #${jobOrderId}`
          }
        ];

        for (const [accountId, amount] of Object.entries(costsByAccount)) {
          if (amount > 0) {
            lines.push({
              journal_entry_id: je.id,
              account_id: parseInt(accountId),
              debit: 0,
              credit: amount,
              description: `منصرف خامات ومستلزمات - أمر #${jobOrderId}`
            });
          }
        }

        await JournalEntryLine.bulkCreate(lines, { transaction: t });
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
  /**
   * Receive Finished Goods (Close Job Order)
   * Dr Finished Goods (Asset)
   * Cr WIP (Asset)
   */
  receiveFinishedGoods: async (jobOrderId, data) => {
    const t = await sequelize.transaction();
    try {
      const order = await ExternalJobOrder.findByPk(jobOrderId, {
        include: [{ model: Party, as: 'party' }],
        transaction: t
      });
      if (!order) throw new Error("Job Order not found");

      // 1. Calculate Actual WIP Costs (Materials + Payments)

      // A. Material Cost (Already issued to WIP 109)
      const materials = await ExternalJobOrderItem.findAll({
        where: { job_order_id: jobOrderId },
        transaction: t
      });
      const totalMaterialCost = materials.reduce((sum, item) => sum + Number(item.total_cost), 0);

      // B. Service Costs (Accrued Service Invoices - recognize cost even if not paid)
      // We check both ExternalJobOrderService (simple system) and JobOrderCostTransaction (from formal Service Invoices)
      const services = await ExternalJobOrderService.findAll({
        where: { job_order_id: jobOrderId },
        transaction: t
      });
      const simpleServiceCost = services.reduce((sum, s) => sum + Number(s.amount), 0);

      const costTransactions = await JobOrderCostTransaction.findAll({
        where: { job_order_id: jobOrderId },
        transaction: t
      });
      const formalServiceCost = costTransactions.reduce((sum, ct) => sum + Number(ct.amount), 0);

      const totalServiceCost = simpleServiceCost + formalServiceCost;

      // Total Cost to capitalize
      const producedQty = Number(data.produced_quantity);
      const wasteQty = Number(data.waste_quantity || 0);
      const orderQty = Number(order.order_quantity || (producedQty + wasteQty));

      // Calculate Service Cost to Capitalize vs to Deduct from Supplier
      // Factor: Produced / Total Order
      const serviceCostToCapitalize = orderQty > 0 ? (totalServiceCost / orderQty) * producedQty : totalServiceCost;
      const serviceCostToDeduct = totalServiceCost - serviceCostToCapitalize;

      // Final Cost for Finished Goods: full material cost (waste materials distributed) + only produced units service cost
      const totalCost = totalMaterialCost + serviceCostToCapitalize;

      const unitCost = producedQty > 0 ? totalCost / producedQty : 0;

      // 2. Update Product Cost (Weighted Average or Last Cost)
      const product = await Product.findByPk(order.product_id, { transaction: t });
      await product.update({ cost_price: unitCost }, { transaction: t });

      // 3. Inventory Transaction (IN) - Finished Good
      await InventoryTransactionService.create({
        product_id: order.product_id,
        warehouse_id: order.warehouse_id,
        transaction_type: 'in',
        quantity: producedQty,
        transaction_date: new Date(),
        source_type: 'external_job_order',
        source_id: jobOrderId,
        notes: `External Job Order #${jobOrderId} - Finished Goods Received`,
        batches: [{
          quantity: producedQty,
          batch_number: data.batch_number || `PROD-${jobOrderId}`,
          expiry_date: data.expiry_date || null,
          cost_per_unit: unitCost
        }]
      }, { transaction: t });

      // 4. Journal Entry (Close WIP -> FG)
      const wipMaterialsAccountId = 127; // WIP - Materials
      const wipServicesAccountId = 128;  // WIP - Services
      const fgInvAccountId = 110; // Finished Goods

      let refType = await ReferenceType.findOne({ where: { code: 'external_job_order_receive' }, transaction: t });
      if (!refType) {
        refType = await ReferenceType.create({
          code: 'external_job_order_receive',
          label: 'أمر تشغيل خارجي - استلام',
          name: 'أمر تشغيل خارجي - استلام',
          description: 'Journal Entry for External Job Order (Finished Goods Receipt)'
        }, { transaction: t });
      }

      const je = await JournalEntry.create({
        entry_type_id: 13, // Production
        reference_type_id: refType.id,
        reference_id: jobOrderId,
        date: new Date(),
        description: `إقفال أمر تشغيل خارجي #${jobOrderId} - استلام منتج تام`,
        status: 'posted'
      }, { transaction: t });

      const jeLines = [];

      if (totalCost > 0) {
        // Debit Finished Goods
        jeLines.push({
          journal_entry_id: je.id,
          account_id: fgInvAccountId,
          debit: totalCost,
          credit: 0,
          description: `استلام منتج تام - أمر #${jobOrderId}`
        });

        // Credit WIP Materials
        jeLines.push({
          journal_entry_id: je.id,
          account_id: wipMaterialsAccountId,
          debit: 0,
          credit: totalMaterialCost,
          description: `إقفال خامات تحت التشغيل - أمر #${jobOrderId}`
        });

        // Credit WIP Services
        jeLines.push({
          journal_entry_id: je.id,
          account_id: wipServicesAccountId,
          debit: 0,
          credit: totalServiceCost,
          description: `إقفال خدمات تحت التشغيل - أمر #${jobOrderId}`
        });

        // Debit Supplier for waste service cost (Deduction)
        if (serviceCostToDeduct > 0.005 && order.party?.account_id) {
          jeLines.push({
            journal_entry_id: je.id,
            account_id: order.party.account_id,
            debit: serviceCostToDeduct,
            credit: 0,
            description: `خصم تكلفة تصنيع هالك (${wasteQty} وحدة) - أمر #${jobOrderId}`
          });
        }
      }

      await JournalEntryLine.bulkCreate(jeLines, { transaction: t });

      // 5. Update Order Status
      await order.update({
        status: 'completed',
        produced_quantity: producedQty,
        waste_quantity: wasteQty,
        // Calculate actual per-unit costs based on total accumulated figures
        actual_processing_cost_per_unit: producedQty > 0 ? serviceCostToCapitalize / producedQty : 0,
        actual_raw_material_cost_per_unit: producedQty > 0 ? totalMaterialCost / producedQty : 0,
        total_actual_cost: totalCost
      }, {
        transaction: t,
        hooks: false
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
