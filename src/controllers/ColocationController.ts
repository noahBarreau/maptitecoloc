import { Request, Response } from "express";
import { ColocationService } from "../services/ColocationService";

export class ColocationController {
  static async listUserColocations(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.userId, 10);
      const colocations = await ColocationService.listUserColocations(userId);
      res.status(200).json(colocations);
    } catch (error: unknown) {
      // Vérification et gestion des erreurs normalisées
      if (error && typeof error === "object" && "statusCode" in error && "errorCode" in error) {
        const customError = error as { statusCode: number, errorCode: string, errMessage: string };
        res.status(customError.statusCode).json({
          statusCode: customError.statusCode,
          errorCode: customError.errorCode,
          errMessage: customError.errMessage,
        });
      }
      // Erreur générique
      res.status(500).json({
        statusCode: 500,
        errorCode: "ERR_UNKNOWN",
        errMessage: "An unknown error occurred.",
      });
    }
  }

  static async createColocation(req: Request, res: Response) {
    try {
      const { location, area, numberOfRooms, ownerOrAgency } = req.body;
      const userId = (req as any).user.id;

      const newColocation = await ColocationService.createColocation(userId, location, area, numberOfRooms, ownerOrAgency);
      res.status(201).json(newColocation);
    } catch (error: unknown) {
      if (error && typeof error === "object" && "statusCode" in error && "errorCode" in error) {
        const customError = error as { statusCode: number, errorCode: string, errMessage: string };
        res.status(customError.statusCode).json({
          statusCode: customError.statusCode,
          errorCode: customError.errorCode,
          errMessage: customError.errMessage,
        });
      }
      res.status(400).json({
        statusCode: 400,
        errorCode: "ERR_UNKNOWN",
        errMessage: "An error occurred while creating the colocation.",
      });
    }
  }

  static async getColocationDetails(req: Request, res: Response) {
    try {
      const colocationId = parseInt(req.params.id);
      const colocationDetails = await ColocationService.getColocationDetails(colocationId);
      res.status(200).json(colocationDetails);
    } catch (error: unknown) {
      if (error && typeof error === "object" && "statusCode" in error && "errorCode" in error) {
        const customError = error as { statusCode: number, errorCode: string, errMessage: string };
        res.status(customError.statusCode).json({
          statusCode: customError.statusCode,
          errorCode: customError.errorCode,
          errMessage: customError.errMessage,
        });
      }
      res.status(400).json({
        statusCode: 400,
        errorCode: "ERR_UNKNOWN",
        errMessage: "An error occurred while fetching colocation details.",
      });
    }
  }

  static async deleteColocation(req: Request, res: Response) {
    try {
      const colocationId = parseInt(req.params.id);
      const result = await ColocationService.deleteColocation(colocationId);
      res.status(200).json(result);
    } catch (error: unknown) {
      if (error && typeof error === "object" && "statusCode" in error && "errorCode" in error) {
        const customError = error as { statusCode: number, errorCode: string, errMessage: string };
        res.status(customError.statusCode).json({
          statusCode: customError.statusCode,
          errorCode: customError.errorCode,
          errMessage: customError.errMessage,
        });
      }
      res.status(400).json({
        statusCode: 400,
        errorCode: "ERR_UNKNOWN",
        errMessage: "An error occurred while deleting colocation.",
      });
    }
  }
}
