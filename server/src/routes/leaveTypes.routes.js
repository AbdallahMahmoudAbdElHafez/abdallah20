import express from "express";
import LeaveTypeController from "../controllers/leaveTypes.controller.js";

const router = express.Router();

router.get("/", LeaveTypeController.getAll);
router.get("/:id", LeaveTypeController.getById);
router.post("/", LeaveTypeController.create);
router.put("/:id", LeaveTypeController.update);
router.delete("/:id", LeaveTypeController.remove);

export default router;
