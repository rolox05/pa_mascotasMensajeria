import { Component } from "@angular/core";
import { MenuComponent } from "./menu/menu.component";
import { UsuarioService, Usuario } from "./usuario/usuario.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html"
})
export class AppComponent {
  title = "Mascotas";

  constructor(public usuarioService: UsuarioService) {

  }

  get usuarioLogueado(): Usuario {
    return this.usuarioService.usuarioLogueado;
  }
}
