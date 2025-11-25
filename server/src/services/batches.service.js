import { Batches, Product } from "../models/index.js";

class BatchesService {
    static async getAll() {
        return await Batches.findAll({
            include: [{ model: Product, as: "product" }]
        });
    }

    static async getById(id) {
        return await Batches.findByPk(id, {
            include: [{ model: Product, as: "product" }]
        });
    }

    static async create(data) {
        return await Batches.create(data);
    }

    static async update(id, data) {
        const batch = await Batches.findByPk(id);
        if (!batch) return null;
        await batch.update(data);
        return batch;
    }

    static async delete(id) {
        const batch = await Batches.findByPk(id);
        if (!batch) return null;
        await batch.destroy();
        return batch;
    }
}

export default BatchesService;
