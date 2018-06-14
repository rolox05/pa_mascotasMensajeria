"use strict";

import * as mongoose from "mongoose";

export interface IMensaje extends mongoose.Document {
  user: mongoose.Schema.Types.ObjectId;
  target: mongoose.Schema.Types.ObjectId;
  mensaje: string;
  updated: Date;
  fromUserName: String;
  created: Date;
  enabled: Boolean;
}

/**
 * Esquema de Conversacion
 */
export let MensajeSchema = new mongoose.Schema({
  target: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Target",
    required: "Usuario es requerido"
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: "Usuario es requerido"
  },
  updated: {
    type: Date,
    default: Date.now
  },
  created: {
    type: Date,
    default: Date.now
  },
  fromUserName: {
    type: String,
    default: ""
  },
  enabled: {
    type: Boolean,
    default: true
  },
  mensaje: {
    type: String,
    default: ""
  }
}, { collection: "mensaje" });

/**
 * Antes de guardar
 */
MensajeSchema.pre("save", function (next: Function) {
  this.updated = Date.now;

  next();
});

export let Mensaje = mongoose.model<IMensaje>("Mensaje", MensajeSchema);