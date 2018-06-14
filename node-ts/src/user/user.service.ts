import { IUserSession, IUserSessionRequest } from "../security/security.service";
import * as express from "express";
import { User, IUser } from "../security/user.schema";
import * as errorHandler from "../utils/error.handler";

export interface IUpdateRequest extends IUserSessionRequest {
    usuarios: IUser[];
  }
export function search(req: IUpdateRequest, res: express.Response) {
    User.find(
        {
          name: new RegExp(req.params.searchCriteria, "i"),
          enabled: true
        },
        function (err: any, users: IUser[]) {
          if (err) return errorHandler.handleError(res, err);

          if (!users) {
            return errorHandler.sendError(res, errorHandler.ERROR_NOT_FOUND, "El usuario no se encuentra.");
          }
          users.forEach(usr => {
              usr.password = "";
          });
          res.json(users);
        });
}

export interface IUserDTO {
    name: string;
    login: string;
    roles: string[];
    updated: Date;
    created: Date;
    enabled: Boolean;
  }