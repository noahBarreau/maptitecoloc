import { connectMySQLDB } from "../configs/databases/mysql.config";
import { MemberEntity } from "../databases/mysql/member.entity";
import { ColocationEntity } from "../databases/mysql/colocation.entity";
import { UserEntity } from "../databases/mysql/user.entity";

export class MemberService {
  static async addMember(colocationId: number, userId: number, ownerId: number) {
    try {
      const memberRepository = connectMySQLDB.getRepository(MemberEntity);
      const colocationRepository = connectMySQLDB.getRepository(ColocationEntity);

      const colocation = await colocationRepository.findOne({
        where: { id: colocationId },
        relations: ["members", "members.user", "owner"],
      });

      if (!colocation) {
        return {
          statusCode: 404,
          errorCode: "COLOCATION_NOT_FOUND",
          errMessage: "Colocation introuvable."
        };
      }

      if (colocation.owner.id !== ownerId) {
        return {
          statusCode: 403,
          errorCode: "UNAUTHORIZED_ACTION",
          errMessage: "Seul le propriétaire peut ajouter des membres."
        };
      }

      const member = new MemberEntity();
      member.colocation = colocation;
      member.user = { id: userId } as UserEntity;

      const savedMember = await memberRepository.save(member);
      return savedMember;
    } catch (error) {
      return {
        statusCode: 500,
        errorCode: "INTERNAL_SERVER_ERROR",
        errMessage: "Une erreur est survenue lors de l'ajout d'un membre. Vérifiez par exemple si un user avec l'id '"+userId+"' existe bien"
      };
    }
  }

  static async removeMember(colocationId: number, userId: number, ownerId: number) {
    try {
      const memberRepository = connectMySQLDB.getRepository(MemberEntity);
      const colocationRepository = connectMySQLDB.getRepository(ColocationEntity);

      const colocation = await colocationRepository.findOne({
        where: { id: colocationId },
        relations: ["members", "members.user", "owner"],
      });

      if (!colocation) {
        return {
          statusCode: 404,
          errorCode: "COLOCATION_NOT_FOUND",
          errMessage: "Colocation introuvable."
        };
      }

      if (colocation.owner.id !== ownerId) {
        return {
          statusCode: 403,
          errorCode: "UNAUTHORIZED_ACTION",
          errMessage: "Seul le propriétaire peut retirer des membres."
        };
      }

      const memberToRemove = await memberRepository.findOne({
        where: { colocation: { id: colocationId }, user: { id: userId } },
      });

      if (!memberToRemove) {
        return {
          statusCode: 404,
          errorCode: "MEMBER_NOT_FOUND",
          errMessage: "Membre introuvable dans cette colocation. Vérifiez par exemple si un user avec l'id '"+userId+"' existe bien"
        };
      }

      await memberRepository.remove(memberToRemove);
      return {
        statusCode: 200,
        message: "Membre retiré avec succès."
      };
    } catch (error) {
      return {
        statusCode: 500,
        errorCode: "INTERNAL_SERVER_ERROR",
        errMessage: "Une erreur est survenue lors du retrait d'un membre. Vérifiez par exemple si un user avec l'id '"+userId+"' existe bien pour cette colocation"
      };
    }
  }

  static async transferColocation(colocationId: number, newOwnerId: number, currentOwnerId: number) {
    try {
      const colocationRepository = connectMySQLDB.getRepository(ColocationEntity);
      const userRepository = connectMySQLDB.getRepository(UserEntity);
      const memberRepository = connectMySQLDB.getRepository(MemberEntity);

      const colocation = await colocationRepository.findOne({
        where: { id: colocationId },
        relations: ["members", "members.user", "owner"],
      });

      if (!colocation) {
        return {
          statusCode: 404,
          errorCode: "COLOCATION_NOT_FOUND",
          errMessage: "Colocation introuvable."
        };
      }

      if (colocation.owner.id !== currentOwnerId) {
        return {
          statusCode: 403,
          errorCode: "UNAUTHORIZED_ACTION",
          errMessage: "Seul le propriétaire actuel peut transférer la colocation."
        };
      }

      const newOwner = await userRepository.findOne({
        where: { id: newOwnerId },
      });

      if (!newOwner) {
        return {
          statusCode: 404,
          errorCode: "NEW_OWNER_NOT_FOUND",
          errMessage: "Le nouveau propriétaire doit être un membre de la colocation."
        };
      }

      const OwnerToMember = await memberRepository.findOne({
        where: { user: { id: currentOwnerId }, colocation: { id: colocation.id }, role: "Owner" },
        relations: ["user", "colocation"],
      });

      const MemberToOwner = await memberRepository.findOne({
        where: { user: { id: newOwnerId }, colocation: { id: colocation.id }, role: "Member" },
        relations: ["user", "colocation"],
      });

      if (!OwnerToMember || !MemberToOwner) {
        return {
          statusCode: 404,
          errorCode: "TRANSFER_CONDITIONS_NOT_MET",
          errMessage: "Le transfert de propriété ne peut pas être effectué."
        };
      }

      colocation.owner = newOwner;
      OwnerToMember.role = "Member";
      MemberToOwner.role = "Owner";

      await memberRepository.save(OwnerToMember);
      await memberRepository.save(MemberToOwner);
      await colocationRepository.save(colocation);

      return {
        statusCode: 200,
        message: "La propriété de la colocation a été transférée avec succès."
      };
    } catch (error) {
      return {
        statusCode: 500,
        errorCode: "INTERNAL_SERVER_ERROR",
        errMessage: "Une erreur est survenue lors du transfert de propriété."
      };
    }
  }

  static async viewMemberProfile(memberId: number, colocationId: number) {
    try {
      const memberRepository = connectMySQLDB.getRepository(MemberEntity);

      const member = await memberRepository.findOne({
        where: { user: { id: memberId }, colocation: { id: colocationId } },
        relations: ["user", "colocation"],
      });

      if (!member) {
        return {
          statusCode: 404,
          errorCode: "MEMBER_NOT_FOUND",
          errMessage: "Membre inexistant ou n'appartenant pas à cette colocation."
        };
      }

      return {
        statusCode: 200,
        data: member.user,
      };
    } catch (error) {
      return {
        statusCode: 500,
        errorCode: "INTERNAL_SERVER_ERROR",
        errMessage: "Une erreur est survenue lors de la consultation du profil du membre."
      };
    }
  }
}
