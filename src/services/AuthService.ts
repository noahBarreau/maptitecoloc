import { UserEntity } from "../databases/mysql/user.entity";
import { Repository } from "typeorm";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class AuthService {
  constructor(private userRepository: Repository<UserEntity>) {}

  // Inscription d'un utilisateur
  async register(data: {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    age: number;
  }) {
    if (data.age < 18) {
      throw {
        statusCode: 422,
        errorCode: "ERR_AGE_RESTRICTION",
        errMessage: "Vous devez avoir au moins 18 ans.",
        form: "registerForm",
        errorFields: [
          { field: "age", message: "L'âge doit être supérieur ou égal à 18." }
        ]
      };
    }

    const existingUser = await this.userRepository.findOneBy({ email: data.email });
    if (existingUser) {
      throw {
        statusCode: 400,
        errorCode: "ERR_EMAIL_TAKEN",
        errMessage: "Cet email est déjà utilisé.",
        form: "registerForm",
        errorFields: [
          { field: "email", message: "Cet email est déjà utilisé." }
        ]
      };
    }

    const password_hash = await bcrypt.hash(data.password, 10);
    const newUser = this.userRepository.create({
      ...data,
      password_hash,
    });

    await this.userRepository.save(newUser);

    // Success : Object simple
    return {
      data: {
        id: newUser.id,
        firstname: newUser.firstname,
        lastname: newUser.lastname,
        email: newUser.email,
        age: newUser.age,
      }
    };
  }

  // Connexion d'un utilisateur
  async login(email: string, password: string) {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw {
        statusCode: 400,
        errorCode: "ERR_INVALID_CREDENTIALS",
        errMessage: "Email ou mot de passe incorrect.",
        form: "loginForm",
        errorFields: [
          { field: "email", message: "Email ou mot de passe incorrect." },
          { field: "password", message: "Email ou mot de passe incorrect." }
        ]
      };
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      throw {
        statusCode: 400,
        errorCode: "ERR_INVALID_CREDENTIALS",
        errMessage: "Email ou mot de passe incorrect.",
        form: "loginForm",
        errorFields: [
          { field: "password", message: "Email ou mot de passe incorrect." }
        ]
      };
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET!, {
      expiresIn: "7d",
    });

    // Success : Object simple
    return {
      data: { token, refreshToken }
    };
  }

  // Rafraîchissement du token
  async refreshToken(refreshToken: string) {
    try {
      const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!);
      const newToken = jwt.sign({ id: (payload as any).id }, process.env.JWT_SECRET!, {
        expiresIn: "1h",
      });

      // Success : Object simple
      return {
        data: { token: newToken }
      };
    } catch {
      throw {
        statusCode: 400,
        errorCode: "ERR_INVALID_REFRESH_TOKEN",
        errMessage: "Token invalide ou expiré.",
        form: "refreshForm",
        errorFields: [
          { field: "refreshToken", message: "Token invalide ou expiré." }
        ]
      };
    }
  }

  // Récupérer les informations de l'utilisateur
  async getMe(userId: number) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw {
        statusCode: 404,
        errorCode: "ERR_USER_NOT_FOUND",
        errMessage: "Utilisateur non trouvé.",
        form: "getUserForm",
        errorFields: [
          { field: "userId", message: "Utilisateur non trouvé." }
        ]
      };
    }

    // Success : Object simple
    return {
      data: {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        age: user.age,
      }
    };
  }

  // Suppression de l'utilisateur
  async deleteUser(userId: number) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw {
        statusCode: 404,
        errorCode: "ERR_USER_NOT_FOUND",
        errMessage: "Utilisateur non trouvé.",
        form: "deleteUserForm",
        errorFields: [
          { field: "userId", message: "Utilisateur non trouvé." }
        ]
      };
    }

    await this.userRepository.delete(userId);

    // Success : Object simple
    return {
      data: { message: "Utilisateur supprimé avec succès." }
    };
  }
}
