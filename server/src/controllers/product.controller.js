import ProductService from "../services/product.service.js";
import response from "../utils/response.js";

class ProductController {
  static async getAll(req, res, next) {
    try {
      const products = await ProductService.getAll();
      response.ok(res, products);
    } catch (err) {
      next(err);
    }
  }

  static async create(req, res, next) {
    try {
      const product = await ProductService.create(req.body);
      response.ok(res, product, 201);
    } catch (err) {
      next(err);
    }
  }

  static async getById(req, res, next) {
    try {
      const product = await ProductService.getById(req.params.id);
      if (!product) return response.notFound(res, "Product not found");
      response.ok(res, product);
    } catch (err) {
      next(err);
    }
  }

  static async update(req, res, next) {
    try {
      const product = await ProductService.update(req.params.id, req.body);
      if (!product) return response.notFound(res, "Product not found");
      response.ok(res, product);
    } catch (err) {
      next(err);
    }
  }

  static async delete(req, res, next) {
    try {
      const product = await ProductService.delete(req.params.id);
      if (!product) return response.notFound(res, "Product not found");
      response.ok(res, { message: "Product deleted" });
    } catch (err) {
      next(err);
    }
  }
}

export default ProductController;
