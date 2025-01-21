import { UserEntity } from "../databases/mysql/user.entity";
import { UserRepository } from "../repositories/user.repository";
import { UserToCreateDTO } from "../types/user/dtos";

export class UserService {
  private userRepository = new UserRepository();

  async registerUser(userToCreate: UserToCreateDTO): Promise<UserEntity> {
    const password_hash = "hash du mot de passe";
    
    const createdUser = this.userRepository.create({...userToCreate, password_hash});

    const savedUser = await this.userRepository.save(createdUser);
    return savedUser;
  }
}