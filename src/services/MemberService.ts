// src/services/MemberService.ts
import { connectMySQLDB } from "../configs/databases/mysql.config";
import { MemberEntity } from "../databases/mysql/member.entity";
import { ColocationEntity } from "../databases/mysql/colocation.entity";
import { UserEntity } from "../databases/mysql/user.entity";

export class MemberService {
  static async addMember(colocationId: number, userId: number, ownerId: number) {
    const memberRepository = connectMySQLDB.getRepository(MemberEntity);
    const colocationRepository = connectMySQLDB.getRepository(ColocationEntity);

    const colocation = await colocationRepository.findOne({
      where: { id: colocationId },
      relations: ["members", "members.user", "owner"],
    });

    if (!colocation) throw new Error("Colocation not found.");

    if (colocation.owner.id !== ownerId) {
      throw new Error("Only the owner can add members.");
    }

    const member = new MemberEntity();
    member.colocation = colocation;
    member.user = { id: userId } as UserEntity;

    return await memberRepository.save(member);
  }


  static async removeMember(colocationId: number, userId: number, ownerId: number) {
    const memberRepository = connectMySQLDB.getRepository(MemberEntity);
    const colocationRepository = connectMySQLDB.getRepository(ColocationEntity);

    const colocation = await colocationRepository.findOne({
      where: { id: colocationId },
      relations: ["members", "members.user", "owner"],
    });

    if (!colocation) throw new Error("Colocation not found.");

    if (colocation.owner.id !== ownerId) {
      throw new Error("Only the owner can add members.");
    }

    const memberToRemove = await memberRepository.findOne({
      where: { colocation: { id: colocationId }, user: { id: userId } },
    });

    if (!memberToRemove) throw new Error("Member not found.");
    return await memberRepository.remove(memberToRemove);
  }

  static async transferColocation(colocationId: number, newOwnerId: number, currentOwnerId: number) {
    const colocationRepository = connectMySQLDB.getRepository(ColocationEntity);
    const userRepository = connectMySQLDB.getRepository(UserEntity);
    const memberRepository = connectMySQLDB.getRepository(MemberEntity);

    const colocation = await colocationRepository.findOne({
      where: { id: colocationId },
      relations: ["members", "members.user", "owner"],
    });
    if (!colocation) throw new Error("Colocation not found.");
    if (colocation.owner.id !== currentOwnerId) {
      throw new Error("Only the owner can remove members.");
    }

    const currentOwner = await userRepository.findOne({
      where: {
        id: currentOwnerId ,
      }
    });

    const newOwner = await userRepository.findOne({
      where: {
        id: newOwnerId ,
      }
    });
    if (!newOwner) throw new Error("New owner must be a member of the colocation.");
    if(currentOwner!=undefined){

      const currentMember = await memberRepository.findOne({
        where: {
          user: { id: newOwner.id } ,
          colocation: { id: colocation.id },
        },
        relations: ["user", "colocation"],
      });
      if(currentMember!=undefined){
        colocation.owner = newOwner;
        currentMember.user=currentOwner;
        await memberRepository.save(currentMember);
        await colocationRepository.save(colocation);
        return { message: "Colocation ownership transferred successfully." };
      }
    }
  }


  static async viewMemberProfile(memberId: number) {
    const memberRepository = connectMySQLDB.getRepository(MemberEntity);

    const member = await memberRepository.findOne({
      where: { id: memberId },
      relations: ["user", "colocation"],
    });

    if (!member) throw new Error("Member not found.");
    return member;
  }
}
