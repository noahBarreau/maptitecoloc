// src/routes/colocation.routes.ts
import { Router } from "express";
import { ColocationController } from "../controllers/ColocationController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.get("/user/:userId", authMiddleware, ColocationController.listUserColocations);
router.post("/create", authMiddleware, ColocationController.createColocation);
router.get("/:id", authMiddleware, ColocationController.getColocationDetails);
router.delete("/:id", authMiddleware, ColocationController.deleteColocation);

export default router;
