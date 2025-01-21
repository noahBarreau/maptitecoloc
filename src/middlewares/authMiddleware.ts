import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token || typeof token !== "string") {
    res.status(401).json({ error: "Accès non autorisé." });
    return;
  }

  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    res.status(500).json({ error: "JWT secret is not defined in environment variables." });
    return;
  }

  try {
    const payload = jwt.verify(token, jwtSecret);
    (req as any).user = payload;
    next();
  } catch (error) {
    res.status(401).json({ error: "Token invalide ou expiré." });
  }
}