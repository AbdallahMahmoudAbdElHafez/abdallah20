import { Product, Unit, CurrentInventory, ProductType } from "../models/index.js";

class ProductService {
  static async getAll(params = {}) {
    const include = [
      { model: Unit, as: "unit" },
      { model: ProductType, as: "type" }
    ];

    if (params.warehouse_id) {
      include.push({
        model: CurrentInventory,
        as: "current_inventory",
        where: { warehouse_id: params.warehouse_id },
        required: false // Keep products even if no inventory record exists (stock 0)
      });
    }

    return await Product.findAll({ include });
  }

  static async create(data) {
    return await Product.create(data);
  }

  static async getById(id) {
    return await Product.findByPk(id, {
      include: [
        { model: Unit, as: "unit" },
        { model: ProductType, as: "type" }
      ]
    });
  }

  static async update(id, data) {
    const product = await Product.findByPk(id);
    if (!product) return null;

    // تحديث المنتج نفسه
    await product.update(data);

    // لو فيه قيمة cost جديدة يتم تحديثها أو إضافتها في product_costs
    if (data.cost) {
      // أغلق آخر سجل تكلفة مفتوح
      await ProductCost.update(
        { end_date: new Date() },
        { where: { product_id: id, end_date: null } }
      );

      // أضف تكلفة جديدة
      await ProductCost.create({
        product_id: id,
        cost: data.cost,
        start_date: new Date(),
      });
    }

    return product;
  }

  static async delete(id) {
    const product = await Product.findByPk(id);
    if (!product) return null;
    await product.destroy();
    return product;
  }
}

export default ProductService;
