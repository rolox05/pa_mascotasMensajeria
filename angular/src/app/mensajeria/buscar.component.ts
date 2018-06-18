import { Component, OnInit, EventEmitter, Output } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { UsuarioService, Usuario } from "../usuario/usuario.service";
import { catchError, debounceTime, distinctUntilChanged, map, tap, switchMap, merge } from "rxjs/operators";
import { of } from "rxjs/observable/of";

@Component({
  selector: "app-buscar",
  templateUrl: "./buscar.component.html"
})
export class BuscarComponent implements OnInit {
  model: any;
  searching = false;
  searchFailed = false;
  resultados: Usuario[];
  @Output() iniciarConversacion = new EventEmitter();

  constructor(private usuarioService: UsuarioService) {}

  buscarUsuarios() {
    this.usuarioService.buscarUsuario(this.model).then(response => {
      this.resultados = response;
    });
  }

  nuevaConversacion(usuario) {
    this.iniciarConversacion.emit(usuario);
  }

  ngOnInit() {
  }
}