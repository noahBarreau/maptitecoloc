import { UserEntity } from "../databases/mysql/user.entity";
import { Repository } from "typeorm";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class AuthService {
  constructor(private userRepository: Repository<UserEntity>) {}

  async register(data: {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    age: number;
  }) {
    if (data.age < 18) {
      throw new Error("Vous devez avoir au moins 18 ans.");
    }

    const existingUser = await this.userRepository.findOneBy({ email: data.email });
    if (existingUser) {
      throw new Error("Cet email est déjà utilisé.");
    }

    const password_hash = await bcrypt.hash(data.password, 10);
    const newUser = this.userRepository.create({
      ...data,
      password_hash,
    });
    return this.userRepository.save(newUser);
  }

  async login(email: string, password: string) {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new Error("Email ou mot de passe incorrect.");
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      throw new Error("Email ou mot de passe incorrect.");
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET!, {
      expiresIn: "7d",
    });

    return { token, refreshToken };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!);
      const newToken = jwt.sign({ id: (payload as any).id }, process.env.JWT_SECRET!, {
        expiresIn: "1h",
      });
      return newToken;
    } catch {
      throw new Error("Token invalide ou expiré.");
    }
  }

  async getMe(userId: number) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new Error("Utilisateur non trouvé.");
    }
    return {
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      age: user.age,
    };
  }

  async deleteUser(userId: number) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new Error("Utilisateur non trouvé.");
    }
    await this.userRepository.delete(userId);
    return { message: "Utilisateur supprimé avec succès." };
  }
}
