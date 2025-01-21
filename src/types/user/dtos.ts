import { Expose } from "class-transformer";
import { UserEntity } from "../../databases/mysql/user.entity";
import { IsString, isString } from "class-validator";

export class UserToCreateDTO {
  @Expose()
  @IsString()
  firstname: UserEntity['firstname'];

  lastname: string;
  email: string;
  password: string;
}