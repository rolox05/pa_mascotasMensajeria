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
/**
 * @apiDefine Mensajeria
 * @api {get} /conversaciones Get Conversaciones
 * @apiName Get Conversaciones
 *
 * @apiDescription Obtiene las conversaciones creardas
 * por el usuario o con el usuario
 *
 * @apiSuccessExample {json} IConversacion
 *  [{
 *     "targetUserName":"Rodrigo Lazarte",
 *     "userName":"usuario1",
 *     "updated":"2018-06-14T16:24:01.922Z",
 *     "created":"2018-06-14T16:24:01.922Z",
 *     "enabled":true,
 *     "_id":"5b2296a17cef1c2a006a2bcd",
 *     "user":"5b200d24dc444a5ff0b5dc07",
 *     "target":"5b1ffea06f448b6108e7692e",
 * }]
 */
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

/**
 * @api {post} /conversaciones Post Conversaciones
 * @apiName Post Conversaciones
 * @apiUse Mensajeria
 *
 * @apiDescription Busca si la conversacion que instanta crearse ya existe
 * si no existe la crea.
 *
 * @apiSuccessExample {json} IConversacion
 *  {
 *     "targetUserName":"Rodrigo Lazarte",
 *     "userName":"usuario1",
 *     "updated":"2018-06-14T16:24:01.922Z",
 *     "created":"2018-06-14T16:24:01.922Z",
 *     "enabled":true,
 *     "_id":"5b2296a17cef1c2a006a2bcd",
 *     "user":"5b200d24dc444a5ff0b5dc07",
 *     "target":"5b1ffea06f448b6108e7692e",
 * }
 */
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

/**
 * @api {get} /mensaje/:targetUser/:originUser Get Mensaje
 * @apiName Get Mensaje
 * @apiUse Mensajeria
 *
 * @apiDescription Obtiene los mensajes creados entre los usuarios
 * targerUser y originUser.
 *
 * @apiSuccessExample {json} IMensaje
 *  [{
 *     "updated":"2018-06-17T17:25:35.221Z",
 *     "created":"2018-06-17T17:25:35.221Z",
 *     "fromUserName":"Rodrigo Sobisch",
 *     "enabled":true,
 *     "mensaje":"Hola, como va?\n",
 *     "_id":"5b26998fd7487f34c0d9fb6a",
 *     "target":"5b200d24dc444a5ff0b5dc07",
 *     "user":"5b03248af89333577de92c2f"
 * }]
 */
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

/**
 * @api {delete} /mensaje/:messageId Delete Mensaje
 * @apiName Delete Mensaje
 * @apiUse Mensajeria
 *
 * @apiDescription Elimina el mensaje si este pertenece al usuario logueado.
 *
 * @apiSuccessExample {json} String
 */
  export function borrarMensaje(req: IUserMensajeRequest, res: express.Response, next: NextFunction) {
    Mensaje.deleteOne({
      _id: req.params.messageId,
      user: req.user._id
    }).exec(function (err, meg) {
      res.send("Document deleted");
    });
  }

/**
 * @api {post} /mensaje/:targetUser/:originUser Post Mensaje
 * @apiName Post Mensaje
 * @apiUse Mensajeria
 *
 * @apiDescription Crea un nuevo mensaje entre los usuarios
 * targerUser y originUser.
 *
 * @apiSuccessExample {json} IMensaje
 *  [{
 *     "updated":"2018-06-17T17:25:35.221Z",
 *     "created":"2018-06-17T17:25:35.221Z",
 *     "fromUserName":"Rodrigo Sobisch",
 *     "enabled":true,
 *     "mensaje":"Hola, como va?\n",
 *     "_id":"5b26998fd7487f34c0d9fb6a",
 *     "target":"5b200d24dc444a5ff0b5dc07",
 *     "user":"5b03248af89333577de92c2f"
 * }]
 */
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