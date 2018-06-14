import { Component, OnInit } from "@angular/core";
import { MascotaService, Mascota } from "./mascota.service";
import { ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs/Rx";
import { Router } from "@angular/router";
import { NgDatepickerModule } from "ng2-datepicker";
import * as esLocale from "date-fns/locale/es";

import { IErrorController } from "../tools/error-handler";
import * as errorHanlder from "../tools/error-handler";
import { Image } from "../perfil/perfil.service";

@Component({
  selector: "app-nueva-mascota",
  styles: [ "/deep/ .ngx-datepicker-input {margin: -6px; margin-left: -10px;} "],
  templateUrl: "./nueva-mascota.component.html"
})
export class NuevaMascotaComponent implements OnInit, IErrorController {
  mascota: Mascota;
  arLocale = esLocale;
  formSubmitted: boolean;
  imagenPerfil: Image;

  errorMessage: string;
  errors: string[] = [];
  imagen: Image;

  constructor(
    private mascotasService: MascotaService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.mascota = {
      _id: undefined,
      name: "",
      birthDate: "",
      description: "",
      image: "",
      imageBlob: {
        image: ""
      }
    };
    this.imagen = {
      image: ""
    };
    this.imagenPerfil = {
      image: "/assets/profile.png"
    };
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params["id"];
      if (id) {
        this.mascotasService
          .buscarMascota(id)
          .then(mascota => {
            this.mascota = mascota;
            if (this.mascota.image) {
              this.mascotasService
                .buscarImagen(this.mascota.image)
                .then(imagen => {
                  this.imagenPerfil = imagen;
                }).catch( error => this.imagenPerfil.image = "/assets/profile.png");
            } else {
              this.imagenPerfil.image = "/assets/profile.png";
            }
          })
          .catch(error => {
            errorHanlder.procesarValidacionesRest(this, error);
            this.imagenPerfil.image = "/assets/profile.png";
          });
      }
    });
  }

  submitForm() {
    errorHanlder.cleanRestValidations(this);

    if (this.imagen.image && !this.mascota.image) {
      this.mascotasService
        .guardarImagen(this.imagen)
        .then(image => {
          this.mascota.image = image.id;
          this.mascotasService
            .guardarMascota(this.mascota)
            .then(usuario => this.router.navigate(["/mascotas"]))
            .catch(error => errorHanlder.procesarValidacionesRest(this, error));
        })
        .catch(error => errorHanlder.procesarValidacionesRest(this, error));
    } else {
      this.mascotasService
        .guardarMascota(this.mascota)
        .then(usuario => this.router.navigate(["/mascotas"]))
        .catch(error => errorHanlder.procesarValidacionesRest(this, error));
    }
  }

  actualizarImagen(imagen: any) {
    this.mascota.image = undefined;
    this.imagenPerfil.image = imagen;
    this.imagen.image = imagen;
  }

  onDelete() {
    errorHanlder.cleanRestValidations(this);
    this.mascotasService
      .eliminarMascota(this.mascota._id)
      .then(any => this.router.navigate(["/mascotas"]))
      .catch(error => errorHanlder.procesarValidacionesRest(this, error));
  }
}
