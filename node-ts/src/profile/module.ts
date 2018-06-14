"use strict";

import { Express } from "express";

import * as security from "../security/security.service";
import * as profile from "./profile.service";
import * as passport from "passport";

export function init(app: Express) {
  app
    .route("/profile")
    .get(passport.authenticate("jwt", { session: false }), profile.fillForCurrentUser, profile.read)
    .put(passport.authenticate("jwt", { session: false }), profile.fillProvinceIfPresent, profile.fillForCurrentUser, profile.validateUpdate, profile.update);
}
