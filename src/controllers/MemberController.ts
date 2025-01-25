// src/controllers/MemberController.ts
import { Request, Response } from "express";
import { MemberService } from "../services/MemberService";

export class MemberController {
    static async addMember(req: Request, res: Response) {
        try {
          const { colocationId, userId } = req.body;
          const ownerId = (req as any).user.id;
          const member = await MemberService.addMember(colocationId, userId, ownerId);
          res.status(201).json(member);
        } catch (error) {
          if (error instanceof Error) {
            res.status(400).json({ error: error.message });
          } else {
            res.status(400).json({ error: "An unknown error occurred." });
          }
        }
      }
      

      static async removeMember(req: Request, res: Response) {
        try {
          const { colocationId, userId } = req.body;
          const ownerId = (req as any).user.id;
          const result = await MemberService.removeMember(colocationId, userId, ownerId);
          res.status(200).json(result);
        } catch (error) {
          if (error instanceof Error) {
            res.status(400).json({ error: error.message });
          } else {
            res.status(400).json({ error: "An unknown error occurred." });
          }
        }
      }
      
      static async transferColocation(req: Request, res: Response) {
        try {
          const { colocationId, newOwnerId } = req.body;
          const currentOwnerId = (req as any).user.id;
          const result = await MemberService.transferColocation(colocationId, newOwnerId, currentOwnerId, req);
          res.status(200).json(result);
        } catch (error) {
          if (error instanceof Error) {
            res.status(400).json({ error: error.message });
          } else {
            res.status(400).json({ error: "An unknown error occurred." });
          }
        }
      }
      
      static async viewMemberProfile(req: Request, res: Response) {
        try {
          const memberId = parseInt(req.params.id, 10);
          const { colocationId } = req.body;
          const profile = await MemberService.viewMemberProfile(memberId, colocationId);
          res.status(200).json(profile);
        } catch (error) {
          if (error instanceof Error) {
            res.status(400).json({ error: error.message });
          } else {
            res.status(400).json({ error: "An unknown error occurred." });
          }
        }
      }
      
}
