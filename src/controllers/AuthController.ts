import { Request, Response } from "express";
import { AuthService } from "../services/AuthService";
import { connectMySQLDB } from "../configs/databases/mysql.config";
import { UserEntity } from "../databases/mysql/user.entity";

const userRepository = connectMySQLDB.getRepository(UserEntity);
const authService = new AuthService(userRepository);

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const user = await authService.register(req.body);
      res.status(201).json(user);
    } catch (error) {
        if (error instanceof Error) {
          res.status(400).json({ error: error.message });
        } else {
          res.status(400).json({ error: "An unknown error occurred." });
        }
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const tokens = await authService.login(email, password);
      res.status(200).json(tokens);
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
          } else {
            res.status(400).json({ error: "An unknown error occurred." });
          }
    }
  }

  static async refresh(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;
  
      if (!refreshToken) {
        res.status(400).json({ error: "Refresh token is required." });
      }
  
      const newToken = await authService.refreshToken(refreshToken);
  
      if (!newToken) {
        res.status(400).json({ error: "Invalid refresh token." });
      }
  
      res.status(200).json({ token: newToken });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: "An unknown error occurred." });
      }
    }
  }
  
  static async getMe(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const user = await authService.getMe(userId);
      res.status(200).json(user);
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
          } else {
            res.status(400).json({ error: "An unknown error occurred." });
          }
    }
  }

  static async deleteUser(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id, 10);
      const response = await authService.deleteUser(userId);
      res.status(200).json(response);
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
          } else {
            res.status(400).json({ error: "An unknown error occurred." });
          }
    }
  }
}
