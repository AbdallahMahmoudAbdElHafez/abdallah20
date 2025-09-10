import { PartyCategory } from "../models/index.js";

class PartyCategoryService {
    static async getAll() {
        return await PartyCategory.findAll();    
    }
    static async getById(id) {
        return await PartyCategory.findByPk(id);
    }
    static async create(data) {
        return await PartyCategory.create(data);
    }
    static async update(id, data) {
        const category = await PartyCategory.findByPk(id);
        if (!category) throw new Error("Party category not found");
        return await category.update(data);
    }
    static async delete(id) {
        return await PartyCategory.destroy({ where: { id } });
    }
}
    
export default PartyCategoryService;
