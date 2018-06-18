import { Component, OnInit, EventEmitter, Output, Input } from "@angular/core";
import { ConversacionService, Conversacion } from "./conversaciones.service";

@Component({
  selector: "app-conversaciones",
  templateUrl: "./conversaciones.component.html"
})
export class ConversacionesComponent implements OnInit {
  @Output() conversacionSeleccionada = new EventEmitter();
  private _conversacion: Conversacion;

  get conversacion(): Conversacion {
    // transform value for display
    return this._conversacion;
  }
  @Input()
  set conversacion(conversacion: Conversacion) {
    this._conversacion = conversacion;
    if (!this._conversacion) return;
    this.getAll();
  }
  private conversaciones: Conversacion[];

  constructor(private conversacionService: ConversacionService) {
  }

  abrirConversacion(conver: Conversacion) {
    this.conversacionSeleccionada.emit({
        user: conver.user,
        target: conver.target
    });
  }

  getAll() {
    this.conversacionService.getAll().then(respuesta => {
      if (!respuesta) return;
      this.conversaciones = respuesta;
    });
  }

  ngOnInit() {
    this.getAll();
  }
}