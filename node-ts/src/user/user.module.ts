"use strict";

import { Express } from "express";
import * as passport from "passport";
import * as user from "../user/user.service";

/**
 * Modulo de seguridad, login/logout, cambio de contraseñas, etc
 */
export function init(app: Express) {
  // passport.authenticate("jwt", { session: false }),
  // app.param(["searchCriteria"], user.search);
  app.route("/buscarUsuario/:searchCriteria").get(passport.authenticate("jwt", { session: false }), user.search);
}
