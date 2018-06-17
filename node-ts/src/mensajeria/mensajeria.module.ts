"use strict";

import { Express } from "express";
import * as passport from "passport";
import * as user from "../user/user.service";
import * as mensajeria from "../mensajeria/mensajeria.service";

/**
 * Modulo de seguridad, login/logout, cambio de contraseñas, etc
 */
export function init(app: Express) {
  app.route("/conversaciones")
    .get(passport.authenticate("jwt", { session: false }), mensajeria.findConversacionesIniciadasByCurrentUser, mensajeria.findConversacionesIniciadasWithCurrentUser)
    .post(passport.authenticate("jwt", { session: false }), mensajeria.findExistingConversation, mensajeria.crearConversacion);

  app.route("/mensaje/:targetUser/:originUser")
    .get(passport.authenticate("jwt", { session: false }), mensajeria.findMensajesBySelectedUser, mensajeria.findMensajesWithSelectedUser)
    .post(passport.authenticate("jwt", { session: false }), mensajeria.createMessageToTargetUser);

  app.route("/mensaje/:messageId")
    .delete(passport.authenticate("jwt", { session: false }), mensajeria.borrarMensaje);
}
