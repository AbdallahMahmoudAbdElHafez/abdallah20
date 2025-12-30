import ProductTypesService from "../services/productTypes.service.js";
import Joi from "joi";

const schema = Joi.object({
    name: Joi.string().max(100).required(),
});

class ProductTypesController {
    static async getAll(req, res) {
        try {
            const types = await ProductTypesService.getAll();
            res.json(types);
        } catch (err) {
            console.error("Error fetching product types:", err);
            res.status(500).json({ error: "فشل في جلب أنواع المنتجات" });
        }
    }

    static async getById(req, res) {
        try {
            const type = await ProductTypesService.getById(req.params.id);
            if (!type) return res.status(404).json({ error: "نوع المنتج غير موجود" });
            res.json(type);
        } catch (err) {
            console.error("Error fetching product type:", err);
            res.status(500).json({ error: "فشل في جلب نوع المنتج" });
        }
    }

    static async create(req, res) {
        try {
            const { error, value } = schema.validate(req.body);
            if (error) return res.status(400).json({ error: error.details[0].message });

            const type = await ProductTypesService.create(value);
            res.status(201).json(type);
        } catch (err) {
            console.error("Error creating product type:", err);
            res.status(500).json({ error: "فشل في إنشاء نوع المنتج" });
        }
    }

    static async update(req, res) {
        try {
            const { error, value } = schema.validate(req.body);
            if (error) return res.status(400).json({ error: error.details[0].message });

            const type = await ProductTypesService.update(req.params.id, value);
            if (!type) return res.status(404).json({ error: "نوع المنتج غير موجود" });
            res.json(type);
        } catch (err) {
            console.error("Error updating product type:", err);
            res.status(500).json({ error: "فشل في تحديث نوع المنتج" });
        }
    }

    static async delete(req, res) {
        try {
            const type = await ProductTypesService.delete(req.params.id);
            if (!type) return res.status(404).json({ error: "نوع المنتج غير موجود" });
            res.json({ message: "تم حذف نوع المنتج بنجاح" });
        } catch (err) {
            console.error("Error deleting product type:", err);
            res.status(500).json({ error: "فشل في حذف نوع المنتج" });
        }
    }
}

export default ProductTypesController;
