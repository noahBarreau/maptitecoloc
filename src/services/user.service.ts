import { UserEntity } from "../databases/mysql/user.entity";
import { UserRepository } from "../repositories/user.repository";
import { UserToCreateDTO } from "../types/user/dtos";

export class UserService {
  private userRepository = new UserRepository();

  // Inscription d'un utilisateur
  async registerUser(userToCreate: UserToCreateDTO): Promise<{ data: UserEntity }> {
    try {
      // Hash du mot de passe 
      const password_hash = "hash du mot de passe";
      
      // Création de l'utilisateur
      const createdUser = this.userRepository.create({ ...userToCreate, password_hash });

      // Sauvegarde de l'utilisateur
      const savedUser = await this.userRepository.save(createdUser);

      // Success : Object simple
      return {
        data: savedUser,
      };
    } catch (error: unknown) {
      // Gestion des erreurs normalisées
      if (error && typeof error === "object" && "statusCode" in error && "errorCode" in error) {
        const customError = error as { statusCode: number, errorCode: string, errMessage: string };
        throw {
          statusCode: customError.statusCode,
          errorCode: customError.errorCode,
          errMessage: customError.errMessage,
        };
      }
      // Erreur générique si l'erreur ne correspond pas à la structure attendue
      throw {
        statusCode: 500,
        errorCode: "ERR_USER_CREATION",
        errMessage: "An error occurred while creating the user.",
      };
    }
  }
}
