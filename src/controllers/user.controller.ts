import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { UserToCreateDTO } from "../types/user/dtos";

const userService = new UserService();

export class UserController {
  // Inscription d'un utilisateur
  static async registerUser(req: Request, res: Response) {
    try {
      const userToCreate: UserToCreateDTO = req.body; // Données pour créer l'utilisateur
      const newUser = await userService.registerUser(userToCreate);
      res.status(201).json(newUser);
    } catch (error: unknown) {
      // Vérification et gestion des erreurs normalisées
      if (error && typeof error === "object" && "statusCode" in error && "errorCode" in error) {
        const customError = error as { statusCode: number, errorCode: string, errMessage: string };
        return res.status(customError.statusCode).json({
          statusCode: customError.statusCode,
          errorCode: customError.errorCode,
          errMessage: customError.errMessage,
        });
      }
      // Erreur générique si l'erreur ne correspond pas à la structure attendue
      res.status(500).json({
        statusCode: 500,
        errorCode: "ERR_UNKNOWN",
        errMessage: "An unknown error occurred.",
      });
    }
  }
}
