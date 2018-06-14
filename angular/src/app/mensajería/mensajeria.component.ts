import { Component, OnInit } from "@angular/core";
import { Conversacion, ConversacionService } from "./conversaciones.service";
import { Usuario } from "../usuario/usuario.service";
import { MensajeService, Mensaje } from "./mensaje.service";

@Component({
  selector: "app-mensajeria",
  templateUrl: "./mensajeria.component.html"
})
export class MensajeriaComponent implements OnInit {
  private conversacionSeleccionada: Conversacion;
  private nuevaConversacion: Conversacion;
  constructor(private conversacionService: ConversacionService, private mensajeService: MensajeService) {
  }

  abrirMensajes(conversacion: Conversacion) {
    this.conversacionSeleccionada = conversacion;
  }

  iniciarConversacion(target: Usuario) {
    this.conversacionService.iniciarConversacion(target).then(response => {
      this.nuevaConversacion = response;
    });
  }

  ngOnInit() {
  }
}
