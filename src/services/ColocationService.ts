import { connectMySQLDB } from "../configs/databases/mysql.config";
import { ColocationEntity } from "../databases/mysql/colocation.entity";
import { UserEntity } from "../databases/mysql/user.entity";
import { MemberEntity } from "../databases/mysql/member.entity";

export class ColocationService {
  
  static async listUserColocations(userId: number) {
    try {
      const colocationRepository = connectMySQLDB.getRepository(ColocationEntity);

      const colocations = await colocationRepository
        .createQueryBuilder("colocation")
        .where("colocation.ownerId = :userId", { userId })
        .getMany();

      return colocations;
    } catch (error) {
      console.error("Error fetching colocations:", error);
      throw new Error("An error occurred while fetching colocations.");
    }
  }

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

      const user = await userRepository.findOneBy({ id: userId });
      if (!user) {
        throw new Error("User not found");
      }

      const colocation = new ColocationEntity();
      colocation.location = location;
      colocation.area = area;
      colocation.numberOfRooms = numberOfRooms;
      colocation.ownerOrAgency = ownerOrAgency;
      colocation.owner = user;

      const newColocation = await colocationRepository.save(colocation);

      const member = new MemberEntity();
      member.colocation = newColocation;
      member.user = user;

      await memberRepository.save(member);

      return newColocation;
    } catch (error) {
      console.error("Error creating colocation:", error);
      throw new Error("An error occurred while creating the colocation.");
    }
  }

  static async getColocationDetails(colocationId: number) {
    try {
      const colocationRepository = connectMySQLDB.getRepository(ColocationEntity);

      const colocation = await colocationRepository
        .createQueryBuilder("colocation")
        .leftJoinAndSelect("colocation.members", "members")
        .where("colocation.id = :id", { id: colocationId })
        .getOne();

      if (!colocation) {
        throw new Error("Colocation not found");
      }

      return colocation;
    } catch (error) {
      console.error("Error fetching colocation details:", error);
      throw new Error("An error occurred while fetching colocation details.");
    }
  }

  static async deleteColocation(colocationId: number) {
    try {
      const colocationRepository = connectMySQLDB.getRepository(ColocationEntity);

      const colocation = await colocationRepository.findOne({ where: { id: colocationId } });
      
      if (!colocation) {
        throw new Error("Colocation not found");
      }

      colocation.ownerOrAgency = "inactive";
      await colocationRepository.save(colocation);

      return { message: "Colocation deleted (marked as inactive)" };
    } catch (error) {
      console.error("Error deleting colocation:", error);
      throw new Error("An error occurred while deleting colocation.");
    }
  }
}
