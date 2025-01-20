// src/controllers/ColocationController.ts
import { Request, Response } from "express";
import { ColocationService } from "../services/ColocationService";  // Assurez-vous de créer un service pour la logique

export class ColocationController {
  static async listUserColocations(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.userId, 10); // Récupérer l'ID utilisateur depuis les paramètres de l'URL
      const colocations = await ColocationService.listUserColocations(userId);
      res.status(200).json(colocations);
    } catch (error) {
      console.error(error);  // Log l'erreur pour débogage
      res.status(500).json({ error: "An error occurred while fetching colocations." });
    }
  }

  static async createColocation(req: Request, res: Response) {
    try {
      const { location, area, numberOfRooms, ownerOrAgency } = req.body;
      const userId = (req as any).user.id;  // Récupérer l'ID de l'utilisateur authentifié

      const newColocation = await ColocationService.createColocation(userId, location, area, numberOfRooms, ownerOrAgency);
      res.status(201).json(newColocation);
    } catch (error) {
      res.status(400).json({ error: "An error occurred while creating the colocation." });
    }
  }

  static async getColocationDetails(req: Request, res: Response) {
    try {
      const colocationId = parseInt(req.params.id);
      const colocationDetails = await ColocationService.getColocationDetails(colocationId);
      res.status(200).json(colocationDetails);
    } catch (error) {
      res.status(400).json({ error: "An error occurred while fetching colocation details." });
    }
  }

  static async deleteColocation(req: Request, res: Response) {
    try {
      const colocationId = parseInt(req.params.id);
      const result = await ColocationService.deleteColocation(colocationId);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ error: "An error occurred while deleting the colocation." });
    }
  }
}
