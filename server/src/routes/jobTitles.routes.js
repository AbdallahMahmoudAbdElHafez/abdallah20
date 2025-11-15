import express from "express";
import jobTitlesController from "../controllers/jobTitles.controller.js";

const router = express.Router();

router.get("/", jobTitlesController.getAll);
router.get("/:id", jobTitlesController.getById);
router.post("/", jobTitlesController.create);
router.put("/:id", jobTitlesController.update);
router.delete("/:id", jobTitlesController.delete);

export default router;
