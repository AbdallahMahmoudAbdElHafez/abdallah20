// src/services/externalJobOrders.service.js
import {
  ExternalJobOrder,
  BillOfMaterial,
  Product
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
  }
};

export default ExternalJobOrdersService;

