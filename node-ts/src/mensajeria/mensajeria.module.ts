"use strict";

import { Express } from "express";
import * as passport from "passport";
import * as user from "../user/user.service";
import * as mensajeria from "../mensajeria/mensajeria.service";
import * as security from "../security/security.service";

/**
 * Modulo de seguridad, login/logout, cambio de contraseñas, etc
 */
export function init(app: Express) {
  app.route("/conversaciones")
    .get(passport.authenticate("jwt", { session: false }), security.validateUserRole , mensajeria.findChatByCurrentUser, mensajeria.findChatWithCurrentUser)
    .post(passport.authenticate("jwt", { session: false }), security.validateUserRole, mensajeria.findExistingConversation, mensajeria.crearConversacion);

  app.route("/mensaje/:targetUser/:originUser")
    .get(passport.authenticate("jwt", { session: false }), security.validateUserRole, mensajeria.findMensajesBySelectedUser, mensajeria.findMensajesWithSelectedUser)
    .post(passport.authenticate("jwt", { session: false }), security.validateUserRole, mensajeria.createMessageToTargetUser);

  app.route("/mensaje/:messageId")
    .delete(passport.authenticate("jwt", { session: false }), security.validateUserRole, mensajeria.borrarMensaje);
}
