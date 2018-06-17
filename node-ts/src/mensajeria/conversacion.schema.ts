"use strict";

import * as mongoose from "mongoose";

export interface IConversacion extends mongoose.Document {
  user: mongoose.Schema.Types.ObjectId;
  target: mongoose.Schema.Types.ObjectId;
  targetUserName: string;
  userName: string;
  updated: Date;
  created: Date;
  enabled: Boolean;
}

/**
 * Esquema de Conversacion
 */
export let ConversacionSchema = new mongoose.Schema({
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
  targetUserName: {
    type: String,
    default: ""
  },
  userName: {
    type: String,
    default: ""
  },
  updated: {
    type: Date,
    default: Date.now
  },
  created: {
    type: Date,
    default: Date.now
  },
  enabled: {
    type: Boolean,
    default: true
  }
}, { collection: "conversaciones" });

/**
 * Antes de guardar
 */
ConversacionSchema.pre("save", function (next: Function) {
  this.updated = Date.now;

  next();
});

export let Conversacion = mongoose.model<IConversacion>("Conversacion", ConversacionSchema);