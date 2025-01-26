import { Request, Response } from "express";
import { AuthService } from "../services/AuthService";
import { connectMySQLDB } from "../configs/databases/mysql.config";
import { UserEntity } from "../databases/mysql/user.entity";

const userRepository = connectMySQLDB.getRepository(UserEntity);
const authService = new AuthService(userRepository);

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const user = await authService.register(req.body, req);
      res.status(201).json(user);
    } catch (error: unknown) {
      // Vérification si l'erreur a la structure attendue
      if (error && typeof error === "object" && "statusCode" in error && "errorCode" in error) {
        // Cast de l'erreur en un type connu
        const customError = error as { statusCode: number, errorCode: string, errMessage: string, form?: string, errorFields?: Array<{ field: string, message: string }> };
        res.status(customError.statusCode).json({
          statusCode: customError.statusCode,
          errorCode: customError.errorCode,
          errMessage: customError.errMessage,
          form: customError.form,
          errorFields: customError.errorFields,
        });
      }
      // Erreur générique si l'erreur ne correspond pas à la structure attendue
      res.status(400).json({
        statusCode: 400,
        errorCode: "ERR_UNKNOWN",
        errMessage: "An unknown error occurred.",
      });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const tokens = await authService.login(email, password, req);
      res.status(200).json(tokens);
    } catch (error: unknown) {
      // Vérification de l'erreur
      if (error && typeof error === "object" && "statusCode" in error && "errorCode" in error) {
        const customError = error as { statusCode: number, errorCode: string, errMessage: string, form?: string, errorFields?: Array<{ field: string, message: string }> };
        res.status(customError.statusCode).json({
          statusCode: customError.statusCode,
          errorCode: customError.errorCode,
          errMessage: customError.errMessage,
          form: customError.form,
          errorFields: customError.errorFields,
        });
      }
      res.status(400).json({
        statusCode: 400,
        errorCode: "ERR_INVALID_CREDENTIALS",
        errMessage: "Email ou mot passe incorrect.",
      });
    }
  }

  static async refresh(req: Request, res: Response) {
    try {
      const authHeader = req.headers["authorization"];
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(400).json({
          statusCode: 400,
          errorCode: "ERR_REFRESH_TOKEN_REQUIRED",
          errMessage: "Refresh token is required in the Authorization header.",
        });
      }

      if(authHeader!=undefined){
        const refreshToken = authHeader.split(" ")[1];
        const newToken = await authService.refreshToken(refreshToken);
        res.status(200).json({
          data: { token: newToken },
        });
      }

    } catch (error: unknown) {
      // Vérification de l'erreur
      if (error && typeof error === "object" && "statusCode" in error && "errorCode" in error) {
        const customError = error as { statusCode: number, errorCode: string, errMessage: string, form?: string, errorFields?: Array<{ field: string, message: string }> };
        res.status(customError.statusCode).json({
          statusCode: customError.statusCode,
          errorCode: customError.errorCode,
          errMessage: customError.errMessage,
          form: customError.form,
          errorFields: customError.errorFields,
        });
      }
      res.status(400).json({
        statusCode: 400,
        errorCode: "ERR_INVALID_REFRESH_TOKEN",
        errMessage: "Token invalide ou expiré.",
      });
    }
  }

  static async getMe(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const user = await authService.getMe(userId, req);
      res.status(200).json(user);
    } catch (error: unknown) {
      if (error && typeof error === "object" && "statusCode" in error && "errorCode" in error) {
        const customError = error as { statusCode: number, errorCode: string, errMessage: string, form?: string, errorFields?: Array<{ field: string, message: string }> };
        res.status(customError.statusCode).json({
          statusCode: customError.statusCode,
          errorCode: customError.errorCode,
          errMessage: customError.errMessage,
          form: customError.form,
          errorFields: customError.errorFields,
        });
      }
      res.status(400).json({
        statusCode: 400,
        errorCode: "ERR_USER_NOT_FOUND",
        errMessage: "Utilisateur non trouvé.",
      });
    }
  }

  static async deleteUser(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id, 10);
      const response = await authService.deleteUser(userId, req);
      res.status(200).json(response);
    } catch (error: unknown) {
      if (error && typeof error === "object" && "statusCode" in error && "errorCode" in error) {
        const customError = error as { statusCode: number, errorCode: string, errMessage: string, form?: string, errorFields?: Array<{ field: string, message: string }> };
        res.status(customError.statusCode).json({
          statusCode: customError.statusCode,
          errorCode: customError.errorCode,
          errMessage: customError.errMessage,
          form: customError.form,
          errorFields: customError.errorFields,
        });
      }
      res.status(400).json({
        statusCode: 400,
        errorCode: "ERR_USER_NOT_FOUND",
        errMessage: "Utilisateurzqzdqzd non trouvé.",
      });
    }
  }
}
