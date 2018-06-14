import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Usuario, UsuarioService } from "../usuario/usuario.service";
import { IErrorController } from "../tools/error-handler";
import * as errorHanlder from "../tools/error-handler";

@Component({
  selector: "app-menu",
  templateUrl: "./menu.component.html"
})
export class MenuComponent implements OnInit, IErrorController {
  loginForm: FormGroup;

  errorMessage: string;
  errors: string[] = [];
  usuarioLogueado: Usuario;

  constructor(fb: FormBuilder, public usuarioService: UsuarioService) {
    this.loginForm = fb.group({
      username: [undefined, Validators.required],
      password: [undefined, Validators.required]
    });
  }

  ngOnInit() {
    this.usuarioService.getPrincipal()
      .then((usuario) => this.usuarioLogueado = usuario)
      .catch((error) => this.usuarioLogueado = undefined);
  }

  login() {
    this.usuarioService
      .login(this.loginForm.value.username, this.loginForm.value.password)
      .then((usuario) => this.usuarioLogueado = usuario)
      .catch(error => {
        errorHanlder.procesarValidacionesRest(this, error);
        this.usuarioLogueado = undefined;
      });
  }

  logout() {
    errorHanlder.cleanRestValidations(this);

    this.usuarioService
      .logout()
      .then(this.usuarioLogueado = undefined)
      .catch(error => {
        errorHanlder.procesarValidacionesRest(this, error);
        this.usuarioLogueado = undefined;
      });
  }
}
