import { Component, OnInit, Input } from "@angular/core";
import { MensajeService, Mensaje } from "./mensaje.service";
import { Conversacion } from "./conversaciones.service";

@Component({
  selector: "app-mensajes",
  templateUrl: "./mensajes.component.html"
})
export class MensajesComponent implements OnInit {
  private mensajes: Mensaje[];
  private nuevoMensaje: String;
  private _conversacion: Conversacion;

  get conversacion(): Conversacion {
    // transform value for display
    return this._conversacion;
  }
  @Input()
  set conversacion(conversacion: Conversacion) {
    this._conversacion = conversacion;
    if (!this._conversacion) return;
    this.abrirConversacion(this._conversacion);
  }

  constructor(private mensajeService: MensajeService) {
  }

  ngOnInit() {
  }

  abrirConversacion(conversacion: Conversacion) {
    this.mensajeService.getAll(conversacion).then(mensajes => {
      this.mensajes = mensajes.sort(function(a: Mensaje, b: Mensaje) {
        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        return new Date(a.created).getTime() - new Date(b.created).getTime();
      });
    });
  }

  enviarMensaje() {
    const nuevo: Mensaje = {
      mensaje: this.nuevoMensaje,
      user: this.conversacion.user,
      target: this.conversacion.target,
      created: new Date(),
      fromUserName: ""
    };
    this.mensajeService.enviarMensaje(nuevo).then(respuesta => {
      this.mensajes = this.mensajes.concat(respuesta).sort(function(a: Mensaje, b: Mensaje) {
        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        return new Date(a.created).getTime() - new Date(b.created).getTime();
      });
      this.nuevoMensaje = "";
    });
  }
}
