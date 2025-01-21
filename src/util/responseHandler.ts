import { Response } from "express";

export class ResponseHandler {

  static success(res: Response, data: any = {}, message = "Succès", statusCode = 200, page = 1, limit = 20, count = 0) {
    if (Array.isArray(data)) {
      return res.status(statusCode).json({
        data,
        page,
        limit,
        count
      });
    }
    return res.status(statusCode).json({
      data,
      message
    });
  }

  static error(res: Response, errorCode: string, errMessage: string, statusCode = 400, formName = "", errorFields = []) {
    return res.status(statusCode).json({
      statusCode,
      errorCode,
      errMessage,
      form: formName,
      errorFields
    });
  }
}
