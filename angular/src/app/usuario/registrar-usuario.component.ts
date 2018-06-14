import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UsuarioService, Usuario } from "./usuario.service";
import { ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs/Rx";
import { Router } from "@angular/router";

import { IErrorController } from "../tools/error-handler";
import * as errorHanlder from "../tools/error-handler";

@Component({
  selector: "app-registrar-usuario",
  templateUrl: "./registrar-usuario.component.html"
})
export class RegistrarUsuarioComponent implements OnInit, IErrorController {
  form: FormGroup;
  formSubmitted: boolean;

  errorMessage: string;
  errors: string[] = [];

  constructor(
    fb: FormBuilder,
    private usuarioService: UsuarioService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = fb.group({
      login: [
        undefined,
        [Validators.required, Validators.minLength(1), Validators.maxLength(50)]
      ],
      name: [
        undefined,
        [Validators.required, Validators.minLength(1), Validators.maxLength(50)]
      ],
      password: [undefined, Validators.required],
      password2: [undefined, Validators.required]
    });
    this.form.patchValue({
      id: undefined,
      name: "",
      password: "",
      password2: "",
      login: ""
    });
  }

  ngOnInit() { }

  submitForm() {
    errorHanlder.cleanRestValidations(this);
    if (this.form.valid) {
      this.usuarioService
        .registrarUsuario({
          login: this.form.value.login,
          password: this.form.value.password,
          name: this.form.value.name
        })
        .then(usuario => this.router.navigate(["/"]))
        .catch(error => errorHanlder.procesarValidacionesRest(this, error));
    } else {
      this.formSubmitted = true;
    }
  }

  cleanRestValidations() {
    this.errorMessage = undefined;
    this.errors = [];
  }

  procesarValidacionesRest(data: any) {
    if (data.message) {
      for (const error of data.message) {
        this.errors[error.path] = error.message;
      }
    } else {
      this.errorMessage = data.message;
    }
  }
}
