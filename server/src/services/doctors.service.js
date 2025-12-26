import { Doctor, City } from "../models/index.js";

class DoctorService {
    static async getAll() {
        return await Doctor.findAll({
            include: [{ model: City, as: "city" }],
        });
    }

    static async getById(id) {
        return await Doctor.findByPk(id, {
            include: [{ model: City, as: "city" }],
        });
    }

    static async create(data) {
        const sanitizedData = { ...data };
        if (sanitizedData.city_id === "") sanitizedData.city_id = null;
        return await Doctor.create(sanitizedData);
    }

    static async update(id, data) {
        const doctor = await Doctor.findByPk(id);
        if (!doctor) return null;
        const sanitizedData = { ...data };
        if (sanitizedData.city_id === "") sanitizedData.city_id = null;
        return await doctor.update(sanitizedData);
    }

    static async delete(id) {
        const doctor = await Doctor.findByPk(id);
        if (!doctor) return null;
        await doctor.destroy();
        return true;
    }
}

export default DoctorService;
