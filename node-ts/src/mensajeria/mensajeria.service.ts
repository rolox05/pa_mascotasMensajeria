import { Conversacion, IConversacion } from "../mensajeria/conversacion.schema";
import { IUserSessionRequest, IUserSession } from "../security/security.service";
import * as express from "express";
import { NextFunction } from "express-serve-static-core";
import { Mensaje, IMensaje } from "./mensaje.schema";
import * as errorHandler from "../utils/error.handler";
import * as mongoose from "mongoose";
import { IUser, User } from "../security/user.schema";

export interface IUserMensajeRequest extends express.Request {
    user: IUser;
    target: IUser;
    mensaje: string;
    mensajes: IMensaje[];
}
export interface IUserConversacionRequest extends express.Request {
    user: IUser;
    target: IUser;
    conversacion: IConversacion;
    conversaciones: IConversacion[];
}
export function findChatByCurrentUser(req: IUserConversacionRequest, res: express.Response, next: NextFunction) {
    Conversacion.find({
      user: req.user._id,
      enabled: true
    }).exec(function (err, conversaciones) {
      if (err) return next();
      req.conversaciones = conversaciones;
      next();
    });
}
export function findChatWithCurrentUser(req: IUserConversacionRequest, res: express.Response, next: NextFunction) {
    Conversacion.find({
      target: req.user._id,
      enabled: true
    }).exec(function (err, conversaciones) {
      if (err) return next();
      conversaciones.forEach(conver => {
        const originalTargetName = conver.targetUserName;
        const originalTarget = conver.target;
        const originalFromName = conver.userName;
        const originalFrom = conver.user;
        conver.target = originalFrom;
        conver.targetUserName = originalFromName;
        conver.user = originalTarget;
        conver.userName = originalTargetName;
      });
      res.json(conversaciones.concat(req.conversaciones));
    });
}

  export function findExistingConversation(req: IUserConversacionRequest, res: express.Response, next: NextFunction) {
    Conversacion.findOne({
        user: req.user._id,
        target: req.body._id
    }).exec(function (err, conversacion) {
        if (err) return next();
        req.conversacion = conversacion;
        next();
      });
  }
  export function crearConversacion(req: IUserConversacionRequest, res: express.Response, next: NextFunction) {
        if (!req.conversacion) {
            const conversacion = new Conversacion();
            conversacion.userName = req.body.from.name;
            conversacion.user = req.body.from.id;
            conversacion.target = req.body.to._id;
            conversacion.targetUserName = req.body.to.name;

            conversacion.save(function (err: any) {
                if (err) return errorHandler.handleError(res, err);
                res.json(conversacion);
            });
        }
  }

  export function findMensajesBySelectedUser(req: IUserMensajeRequest, res: express.Response, next: NextFunction) {
    Mensaje.find({
      user: req.params.originUser,
      target: req.params.targetUser,
      enabled: true
    }).exec(function (err, mensajes) {
      if (err) return next();
      req.mensajes = mensajes;
      next();
    });
  }

  export function borrarMensaje(req: IUserMensajeRequest, res: express.Response, next: NextFunction) {
    Mensaje.deleteOne({
      _id: req.params.messageId
    }).exec(function (err) {
      res.send("Document deleted");
    });
  }

  export function findMensajesWithSelectedUser(req: IUserMensajeRequest, res: express.Response, next: NextFunction) {
    Mensaje.find({
      user: req.params.targetUser,
      target: req.params.originUser,
      enabled: true
    }).exec(function (err, mensajes) {
      if (err) return next();
      res.json(mensajes.concat(req.mensajes));
    });
  }

  export function createMessageToTargetUser(req: IUserMensajeRequest, res: express.Response, next: NextFunction) {
    const targetUser = req.user._id === req.body.user ? req.body.target : req.body.user;
    const fromUser = req.user._id === req.body.user ? req.body.user : req.body.target;
    const mensaje = new Mensaje();
    User.findOne(
      {
        _id: req.user._id,
        enabled: true
      },
      function (err: any, user: IUser) {
        if (err) return errorHandler.handleError(res, err);

        if (!user) {
          return errorHandler.sendError(res, errorHandler.ERROR_NOT_FOUND, "El usuario no se encuentra.");
        }
        mensaje.target = targetUser;
        mensaje.user = fromUser;
        mensaje.fromUserName = user.name;
        mensaje.mensaje = req.body.mensaje;

        mensaje.save(function (err: any) {
            if (err) return errorHandler.handleError(res, err);
            res.json(mensaje);
        });
      });
  }