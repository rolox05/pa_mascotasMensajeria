import { Component, OnInit } from "@angular/core";
import { Conversacion, ConversacionService } from "./conversaciones.service";
import { Usuario, UsuarioService } from "../usuario/usuario.service";
import { MensajeService, Mensaje } from "./mensaje.service";

@Component({
  selector: "app-mensajeria",
  templateUrl: "./mensajeria.component.html"
})
export class MensajeriaComponent implements OnInit {
  private conversacionSeleccionada: Conversacion;
  private nuevaConversacion: Conversacion;
  constructor(private conversacionService: ConversacionService, private mensajeService: MensajeService, private usuarioService: UsuarioService) {
  }

  abrirMensajes(conversacion: Conversacion) {
    this.conversacionSeleccionada = conversacion;
  }

  iniciarConversacion(target: Usuario) {
    const dtoModel = new ConversationDTO();
    dtoModel.from = this.usuarioService.usuarioLogueado;
    dtoModel.to = target;
    this.conversacionService.iniciarConversacion(dtoModel).then(response => {
      this.nuevaConversacion = response;
    });
  }

  ngOnInit() {
  }
}

export class ConversationDTO {
  from: Usuario;
  to: Usuario;
}