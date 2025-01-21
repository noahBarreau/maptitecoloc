// src/routes/member.routes.ts
import { Router } from "express";
import { MemberController } from "../controllers/MemberController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post("/add", authMiddleware, MemberController.addMember);
router.post("/remove", authMiddleware, MemberController.removeMember);
router.post("/transfer", authMiddleware, MemberController.transferColocation);
router.get("/profile/:id", authMiddleware, MemberController.viewMemberProfile);

export default router;
