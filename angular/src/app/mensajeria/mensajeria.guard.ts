import { CanActivate } from "@angular/router";
import { UsuarioService } from "../usuario/usuario.service";
import { Injectable } from "@angular/core";

@Injectable()
export class UserAuthGuard implements CanActivate {
  constructor(private userService: UsuarioService) {}
  canActivate() {
    if (!this.userService.usuarioLogueado) return false;
    return this.userService.usuarioLogueado.rol.some(role => {
      return role === "user";
    });
  }
}