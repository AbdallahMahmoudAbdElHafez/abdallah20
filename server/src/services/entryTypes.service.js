
import { EntryType } from "../models/index.js";

class EntryTypeService {
    static async getAll() {
        return await EntryType.findAll();
    }

    static async create(data) {
        return await EntryType.create(data);
    }

    static async getById(id) {
        return await EntryType.findByPk(id);
    }

    static async update(id, data) {
        const entryType = await EntryType.findByPk(id);
        if (!entryType) return null;
        return await entryType.update(data);
    }

    static async delete(id) {
        const entryType = await EntryType.findByPk(id);
        if (!entryType) return null;
        await entryType.destroy();
        return entryType;
    }
}

export default EntryTypeService;
