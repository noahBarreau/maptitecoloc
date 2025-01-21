import { connectMySQLDB } from "../configs/databases/mysql.config";
import { ColocationEntity } from "../databases/mysql/colocation.entity";
import { UserEntity } from "../databases/mysql/user.entity";
import { MemberEntity } from "../databases/mysql/member.entity";

export class ColocationService {
  
  static async listUserColocations(userId: number) {
    try {
      const colocationRepository = connectMySQLDB.getRepository(ColocationEntity);

      const colocations = await colocationRepository.find({
        where: { 
          owner: { id: userId } 
        }
      });

      return {
        data: colocations
      };
    } catch (error) {
      console.error("Error fetching colocations:", error);
      throw {
        statusCode: 500,
        errorCode: "ERR_FETCHING_COLOCATIONS",
        errMessage: "An error occurred while fetching colocations.",
      };
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
        throw {
          statusCode: 404,
          errorCode: "ERR_USER_NOT_FOUND",
          errMessage: "User not found",
        };
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
      member.role = "Owner";

      await memberRepository.save(member);

      return {
        data: newColocation
      };
    } catch (error) {
      console.error("Error creating colocation:", error);
      throw {
        statusCode: 500,
        errorCode: "ERR_CREATING_COLOCATION",
        errMessage: "An error occurred while creating the colocation.",
      };
    }
  }

  static async getColocationDetails(colocationId: number) {
    try {
      const colocationRepository = connectMySQLDB.getRepository(ColocationEntity);

      const colocation = await colocationRepository.findOne({
        where: { 
          id: colocationId
        },
        relations: ["members", "members.user", "owner"],
      });

      if (!colocation) {
        throw {
          statusCode: 404,
          errorCode: "ERR_COLOCATION_NOT_FOUND",
          errMessage: "Colocation not found",
        };
      }

      return {
        data: colocation
      };
    } catch (error) {
      console.error("Error fetching colocation details:", error);
      throw {
        statusCode: 500,
        errorCode: "ERR_FETCHING_COLOCATION_DETAILS",
        errMessage: "An error occurred while fetching colocation details.",
      };
    }
  }

  static async deleteColocation(colocationId: number) {
    try {
      const colocationRepository = connectMySQLDB.getRepository(ColocationEntity);

      const colocation = await colocationRepository.findOne({ 
        where: { 
          id: colocationId 
        } 
      });
      
      if (!colocation) {
        throw {
          statusCode: 404,
          errorCode: "ERR_COLOCATION_NOT_FOUND",
          errMessage: "Colocation not found",
        };
      }

      colocation.ownerOrAgency = "inactive";
      await colocationRepository.save(colocation);

      return {
        data: { message: "Colocation deleted (marked as inactive)" }
      };
    } catch (error) {
      console.error("Error deleting colocation:", error);
      throw {
        statusCode: 500,
        errorCode: "ERR_DELETING_COLOCATION",
        errMessage: "An error occurred while deleting colocation.",
      };
    }
  }
}
