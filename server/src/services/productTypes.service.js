import { ProductType } from "../models/index.js";

class ProductTypesService {
    static async getAll() {
        return await ProductType.findAll({ order: [['name', 'ASC']] });
    }

    static async getById(id) {
        return await ProductType.findByPk(id);
    }

    static async create(data) {
        return await ProductType.create(data);
    }

    static async update(id, data) {
        const type = await ProductType.findByPk(id);
        if (!type) return null;
        await type.update(data);
        return type;
    }

    static async delete(id) {
        const type = await ProductType.findByPk(id);
        if (!type) return null;
        await type.destroy();
        return type;
    }
}

export default ProductTypesService;
