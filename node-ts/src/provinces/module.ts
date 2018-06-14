"use strict";

import { Express } from "express";
import * as province from "./province.service";
import * as passport from "passport";
import * as security from "../security/security.service";

/**
 * Configura e inicializa los contenidos del Modulo
 */
export function init(app: Express) {
  // Rutas del controler
  app.route("/province")
    .get(province.list)
    .put(passport.authenticate("jwt", { session: false }), security.validateAdminRole, province.validateUpdate, province.update);

  app.route("/province/:provinceId")
    .get(province.read)
    .delete(passport.authenticate("jwt", { session: false }), security.validateAdminRole, province.validateUpdate, province.remove);

  // Filtro automatico para agregar la provincia en el request
  // cuando se recibe como parametro provinciaId
  app.param("provinceId", province.findByID);
}
