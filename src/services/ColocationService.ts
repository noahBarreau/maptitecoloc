import { connectMySQLDB } from "../configs/databases/mysql.config";
import { ColocationEntity } from "../databases/mysql/colocation.entity";
import { UserEntity } from "../databases/mysql/user.entity";
import { MemberEntity } from "../databases/mysql/member.entity";  // Assurez-vous d'importer MemberEntity si nécessaire

export class ColocationService {
  
  // Méthode pour lister les colocations d'un utilisateur par son ID
  static async listUserColocations(userId: number) {
    try {
      const colocationRepository = connectMySQLDB.getRepository(ColocationEntity);

      // Requête pour récupérer toutes les colocations associées à l'utilisateur
      const colocations = await colocationRepository
        .createQueryBuilder("colocation")
        .where("colocation.ownerId = :userId", { userId })  // Vérifier que `ownerId` est bien un champ dans la table
        .getMany();  // Récupère toutes les colocations de l'utilisateur

      return colocations;
    } catch (error) {
      console.error("Error fetching colocations:", error);
      throw new Error("An error occurred while fetching colocations.");
    }
  }

  // Méthode pour créer une nouvelle colocation
  static async createColocation(
    userId: number,
    location: string,
    area: number,
    numberOfRooms: number,
    ownerOrAgency: string
  ) {
    try {
      const colocationRepository = connectMySQLDB.getRepository(ColocationEntity);
      const memberRepository = connectMySQLDB.getRepository(MemberEntity);
      const userRepository = connectMySQLDB.getRepository(UserEntity);

      // Récupérer l'utilisateur (propriétaire de la colocation)
      const user = await userRepository.findOneBy({ id: userId });
      if (!user) {
        throw new Error("User not found");
      }

      // Créer une nouvelle colocation
      const colocation = new ColocationEntity();
      colocation.location = location;
      colocation.area = area;
      colocation.numberOfRooms = numberOfRooms;
      colocation.ownerOrAgency = ownerOrAgency;
      colocation.owner = user;  // Associer l'utilisateur comme propriétaire

      const newColocation = await colocationRepository.save(colocation);

      // Lier l'utilisateur à cette nouvelle colocation (en tant que membre)
      const member = new MemberEntity();
      member.colocation = newColocation;  // Associer la colocation
      member.user = user;  // Associer l'utilisateur comme membre

      await memberRepository.save(member);  // Sauvegarder le membre

      return newColocation;
    } catch (error) {
      console.error("Error creating colocation:", error);
      throw new Error("An error occurred while creating the colocation.");
    }
  }

  // Méthode pour récupérer les détails d'une colocation (avec ses membres)
  static async getColocationDetails(colocationId: number) {
    try {
      const colocationRepository = connectMySQLDB.getRepository(ColocationEntity);

      const colocation = await colocationRepository
        .createQueryBuilder("colocation")
        .leftJoinAndSelect("colocation.members", "members")  // Associe les membres à la colocation
        .where("colocation.id = :id", { id: colocationId })
        .getOne();  // Récupère la colocation avec ses membres

      if (!colocation) {
        throw new Error("Colocation not found");
      }

      return colocation;
    } catch (error) {
      console.error("Error fetching colocation details:", error);
      throw new Error("An error occurred while fetching colocation details.");
    }
  }

  // Méthode pour supprimer une colocation (ne pas la supprimer physiquement, mais la marquer comme inactive)
  static async deleteColocation(colocationId: number) {
    try {
      const colocationRepository = connectMySQLDB.getRepository(ColocationEntity);

      const colocation = await colocationRepository.findOne({ where: { id: colocationId } });
      
      if (!colocation) {
        throw new Error("Colocation not found");
      }

      // Marquer la colocation comme inactive au lieu de la supprimer physiquement
      colocation.ownerOrAgency = "inactive";  // Vous pouvez utiliser un autre champ pour le statut
      await colocationRepository.save(colocation); // Sauvegarder la modification

      return { message: "Colocation deleted (marked as inactive)" };
    } catch (error) {
      console.error("Error deleting colocation:", error);
      throw new Error("An error occurred while deleting colocation.");
    }
  }
}
