import { Router } from "express";
import controller from "../controllers/issueVoucherTypeAccounts.controller.js";

const router = Router();

router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.get("/type/:typeId", controller.getByType);
router.post("/", controller.create);
router.post("/bulk", controller.bulkCreate);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);

export default router;
