// src/routes/colocation.routes.ts
import { Router } from "express";
import { ColocationController } from "../controllers/ColocationController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.get("/user/:userId",  ColocationController.listUserColocations);
router.post("/create", authMiddleware, ColocationController.createColocation);
router.get("/:id", ColocationController.getColocationDetails);
router.delete("/delete/:id", authMiddleware, ColocationController.deleteColocation);

export default router;
