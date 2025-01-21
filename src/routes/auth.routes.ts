import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/refresh", AuthController.refresh);
router.get("/getMe", authMiddleware,  AuthController.getMe);
router.delete("/users/:id", authMiddleware, AuthController.deleteUser);

export default router;
