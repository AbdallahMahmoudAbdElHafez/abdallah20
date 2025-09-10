import { Product, Unit } from "../models/index.js";

class ProductService {
  static async getAll() {
    return await Product.findAll({ include: [{ model: Unit, as: "unit" }] });
  }

  static async create(data) {
    return await Product.create(data);
  }

  static async getById(id) {
    return await Product.findByPk(id, { include: [{ model: Unit, as: "unit" }] });
  }

  static async update(id, data) {
    const product = await Product.findByPk(id);
    if (!product) return null;
    return await product.update(data);
  }

  static async delete(id) {
    const product = await Product.findByPk(id);
    if (!product) return null;
    await product.destroy();
    return product;
  }
}

export default ProductService;
