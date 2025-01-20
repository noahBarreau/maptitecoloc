import { Router } from "express";
import { AuthController } from "../controllers/AuthController";  // Vérifiez que le chemin vers AuthController est correct
import { authMiddleware } from "../middlewares/authMiddleware";  // Vérifiez que le chemin est correct

const router = Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/refresh", AuthController.refresh);
router.get("/getMe", authMiddleware,  AuthController.getMe);
router.delete("/users/:id", authMiddleware, AuthController.deleteUser);

export default router;
