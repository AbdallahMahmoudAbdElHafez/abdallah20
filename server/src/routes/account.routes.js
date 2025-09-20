
import { Router } from "express";
const router = Router();    
import Account from "../models/account.model.js"; // أو المسار المناسب إلى موديل الـAccount
import  AccountController from "../controllers/account.controller.js";


// ✅ بقية الـCRUD
router.get("/", AccountController.getAll);
router.get("/:id", AccountController.getById);
router.post("/", AccountController.create);
router.put("/:id", AccountController.update);
router.delete("/:id", AccountController.delete);

/**
 * ✅  Endpoint جديد: جلب جميع الحسابات الفرعية
 * التي Parent لها حساب اسمه "صندوق وبنوك"
 */
router.get("/payment-accounts", async (req, res, next) => {
  try {
    // ابحث عن الحساب الرئيسي باسم "صندوق وبنوك"
    const parent = await Account.findOne({ where: { name: "صندوق وبنوك" } });
    if (!parent) return res.json([]);

    // اجلب كل الحسابات التي parent_account_id = parent.id
    const accounts = await Account.findAll({
      where: { parent_account_id: parent.id },
      order: [["name", "ASC"]],
    });

    res.json(accounts);
  } catch (err) {
    next(err);
  }
});

export default router;


