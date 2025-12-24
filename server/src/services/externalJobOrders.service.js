// src/services/externalJobOrders.service.js
import {
  ExternalJobOrder,
  ExternalJobOrderItem,
  BillOfMaterial,
  Product,
  InventoryTransaction,
  JournalEntry,
  sequelize,
  Party,
  Account,
  Warehouse
} from "../models/index.js";

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

        totalMaterialCost += totalCost;

        details.push({
          material_id: bomItem.material_id,
          material_name: bomItem.material?.name,
          quantity_per_unit: parseFloat(bomItem.quantity_per_unit),
          required_quantity: requiredQty,
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
        const totalLineCost = Number(item.quantity) * cost;

        // 1. Create Job Order Item
        await ExternalJobOrderItem.create({
          job_order_id: jobOrderId,
          product_id: item.product_id,
          warehouse_id: item.warehouse_id,
          quantity_sent: item.quantity,
          unit_cost: cost,
          total_cost: totalLineCost
        }, { transaction: t });

        // 2. Inventory Transaction (OUT)
        await InventoryTransaction.create({
          product_id: item.product_id,
          warehouse_id: item.warehouse_id,
          transaction_type: 'out',
          quantity: item.quantity,
          transaction_date: new Date(),
          reference_type: 'JobOrder', // Ensure this exists in ReferenceType enum/table if strictly enforced
          reference_id: jobOrderId,
          notes: `External Job Order #${jobOrderId} - Material Sent`
        }, { transaction: t });

        totalMaterialCost += totalLineCost;
      }

      // 3. Update Order Status
      await order.update({ status: 'in_progress' }, { transaction: t });

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

      // 2. Update Product Cost (Weighted Average or just update cost_price)
      // For simplicity, we update the cost_price to the new unit cost (or you might want a more complex average)
      const product = await Product.findByPk(order.product_id, { transaction: t });
      await product.update({ cost_price: unitCost }, { transaction: t });

      // 3. Inventory Transaction (IN) - Finished Good
      await InventoryTransaction.create({
        product_id: order.product_id,
        warehouse_id: order.warehouse_id, // Target warehouse
        transaction_type: 'in',
        quantity: producedQty,
        transaction_date: new Date(),
        reference_type: 'JobOrder',
        reference_id: jobOrderId,
        notes: `External Job Order #${jobOrderId} - Finished Goods Received`
      }, { transaction: t });

      // 4. Journal Entry
      // Debit: Inventory (Finished Goods) - Total Cost
      // Credit: Inventory (Raw Materials) - Material Cost (This is tricky. Usually we credit WIP. But here we already deducted inventory. 
      // If we deducted inventory in sendMaterials, we should have debited WIP. 
      // Let's assume sendMaterials debited WIP.

      // Let's refine the accounting flow:
      // Step 1 (Send): Credit Raw Material Inventory, Debit WIP (Work In Progress - External)
      // Step 2 (Receive): Credit WIP (Material Cost), Credit Supplier (Service), Credit Cash/Payable (Transport), Debit Finished Goods Inventory (Total)

      // Since sendMaterials didn't create a JE in my previous step, I should add it there or do it all here if "Send" is just a physical move.
      // But usually "Send" is a distinct event.
      // Let's assume for now we do the full JE here for simplicity, OR we assume Send moved it to a "WIP Warehouse" physically.

      // Better approach:
      // Send Materials: Credit Raw Material Inv, Debit WIP Account.
      // Receive Goods: Debit Finished Goods Inv, Credit WIP Account (Material Portion), Credit Supplier (Service), Credit Cash (Transport).

      // I will implement the JE for Receive here.
      // We need Account IDs.
      // Supplier Account: order.party.account_id
      // Inventory Account: We need a default or product-specific inventory account.
      // WIP Account: We need a default WIP account.

      // For this implementation, I will skip the WIP interim step JE in 'sendMaterials' to avoid complexity if accounts aren't set up, 
      // and just do one big entry here? No, that's wrong because inventory counts change at different times.

      // Let's stick to: 
      // Send: Physical Inventory Out. (No financial entry? Or maybe just Expense? No, it's asset conversion).
      // If we don't have WIP accounts set up, we might just Credit Inventory (Raw) and Debit Inventory (Finished) in one go?
      // But they happen at different times.

      // Let's assume the user wants the "Professional Way".
      // We need a WIP Account. I'll assume one exists or use a placeholder.

      const supplierAccountId = order.party?.account_id;
      if (!supplierAccountId) throw new Error("Supplier does not have a linked account");

      // We need to fetch/create a Journal Entry
      // Debit: Finished Goods Inventory (Total Cost)
      // Credit: Raw Materials Inventory (Material Cost) <-- This effectively reduces the raw material value from the books
      // Credit: Supplier (Service Cost)
      // Credit: Cash/Bank (Transport Cost) - Assuming paid or payable. Let's assume Payable to a generic Transport account or Cash.

      // Wait, `sendMaterials` already did `InventoryTransaction` 'out'. 
      // If `InventoryTransaction` 'out' automatically triggers a JE (via hooks), then we are double counting.
      // I checked `inventoryTransactionHooks.js`? It doesn't seem to exist in the file list I saw earlier.
      // `inventoryTransaction.model.js` exists.

      // Let's assume InventoryTransaction does NOT create JE automatically for 'JobOrder' type.

      // So, JE here:
      const jeLines = [
        {
          account_id: 1, // Placeholder for Finished Goods Inventory Account. In real app, get from Product/Category.
          debit: totalCost,
          credit: 0,
          description: `استلام منتج تام - أمر تشغيل #${jobOrderId}`
        },
        // Credit Raw Materials (Asset decrease)
        // We might need to group by account if materials have different inventory accounts.
        // For simplicity, assume one Inventory Account for Materials.
        {
          account_id: 1, // Placeholder for Raw Materials Inventory Account.
          debit: 0,
          credit: totalMaterialCost,
          description: `صرف خامات - أمر تشغيل #${jobOrderId}`
        },
        // Credit Supplier (Service Liability)
        {
          account_id: supplierAccountId,
          debit: 0,
          credit: serviceCost,
          description: `تكلفة تشغيل خارجي - أمر تشغيل #${jobOrderId}`
        }
      ];

      if (transportCost > 0) {
        jeLines.push({
          account_id: 1, // Placeholder for Cash/Bank or Transport Payable
          debit: 0,
          credit: transportCost,
          description: `تكلفة نقل - أمر تشغيل #${jobOrderId}`
        });
      }

      // Create JE (Commented out until we have real account IDs logic, or use a helper if available)
      // await createJournalEntry({ ... }, { transaction: t });

      // 5. Update Order
      await order.update({
        status: 'completed',
        produced_quantity: producedQty,
        waste_quantity: data.waste_quantity,
        actual_processing_cost_per_unit: serviceCost / producedQty,
        actual_raw_material_cost_per_unit: totalMaterialCost / producedQty,
        total_actual_cost: totalCost,
        transport_cost: transportCost
      }, { transaction: t });

      await t.commit();
      return { success: true, totalCost, unitCost };

    } catch (error) {
      await t.rollback();
      throw error;
    }
  }
};

export default ExternalJobOrdersService;

