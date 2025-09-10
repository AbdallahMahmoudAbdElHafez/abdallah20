import { Router } from "express";
import ProductController from "../controllers/product.controller.js";
const router = Router();

router.get("/", ProductController.getAll);
router.post("/", ProductController.create);
router.get("/:id", ProductController.getById);
router.put("/:id", ProductController.update);
router.delete("/:id", ProductController.delete);


export default router;