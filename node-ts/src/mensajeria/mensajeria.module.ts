"use strict";

import { Express } from "express";
import * as passport from "passport";
import * as user from "../user/user.service";
import * as mensajeria from "../mensajeria/mensajeria.service";

/**
 * Modulo de seguridad, login/logout, cambio de contraseñas, etc
 */
export function init(app: Express) {
  // passport.authenticate("jwt", { session: false }),
  // app.param(["searchCriteria"], user.search);
  app.route("/conversaciones")
     .get(passport.authenticate("jwt", { session: false }), mensajeria.findConversacionesIniciadasByCurrentUser, mensajeria.findConversacionesIniciadasWithCurrentUser)
     .post(passport.authenticate("jwt", { session: false }), mensajeria.findExistingConversation, mensajeria.crearConversacion);
  /*app.route("/conversaciones/:targetUser")
     .get(passport.authenticate("jwt", { session: false }), mensajeria.findConversacionesByCurrentUser)
     .post(passport.authenticate("jwt", { session: false }), mensajeria.findExistingConversation)
     .delete(passport.authenticate("jwt", { session: false }), user.search);*/
    app.route("/mensaje/:targetUser/:originUser")
         .get(passport.authenticate("jwt", { session: false }), mensajeria.findMensajesBySelectedUser, mensajeria.findMensajesWithSelectedUser)
         .post(passport.authenticate("jwt", { session: false }), mensajeria.createMessageToTargetUser);
    app.route("/mensaje/:targetUser")
     .delete(passport.authenticate("jwt", { session: false }), user.search);
}
