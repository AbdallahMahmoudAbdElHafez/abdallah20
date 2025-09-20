import express from "express";
import * as ctrl from "../controllers/accountingSettings.controller.js";

const router = express.Router();

router.get("/", ctrl.listSettings);

router.get("/:id", ctrl.getSetting);
router.post("/", ctrl.createSetting);
router.put("/:id", ctrl.updateSetting);
router.delete("/:id", ctrl.deleteSetting);

export default router;
