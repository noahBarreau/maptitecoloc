import { HistoricEntity } from "../databases/mysql/historic.entity";
import { connectMySQLDB } from "../configs/databases/mysql.config";
import { UserEntity } from "../databases/mysql/user.entity";
import { Repository } from "typeorm";

export class HistoricService {
    constructor(private hsitoricRepository: Repository<HistoricEntity>) {}
    
    static async createLog(method: string, url: string, action: string, user: string, comment: string, successful : boolean) {
      try {
        const historicRepository = connectMySQLDB.getRepository(HistoricEntity);

        const Log = new HistoricEntity();
        Log.method = method;
        Log.url= url;
        Log.action= action;
        Log.user= user;
        Log.comment= comment;
        Log.successful= successful;

        const newLog = await historicRepository.save(Log);

        return {
          data: newLog
        };
      }catch(error){
        console.error("Error creating log in Historic Table", error);
        throw {
            statusCode: 500,
            errorCode: "ERR_CREATING_LOG",
            errMessage: "Une erreur est survenu lors de l'ajout d'un log dans la table 'Historic'",
        };
      }
    }
}
