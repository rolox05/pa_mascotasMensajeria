import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import { RestBaseService } from "../tools/rest.tools";
import "rxjs/add/operator/toPromise";
import { Image } from "../perfil/perfil.service";

@Injectable()
export class MascotaService extends RestBaseService {
  private url = "/pet";
  private imagenUrl = "/image";

  constructor(private http: Http) {
    super();
  }

  buscarMascotas(): Promise<Mascota[]> {
    return this.http
      .get(MascotaService.serverUrl + this.url, this.getRestHeader())
      .toPromise()
      .then(response => {
        return response.json() as Mascota[];
      })
      .catch(this.handleError);
  }

  buscarMascota(id: number): Promise<Mascota> {
    return this.http
      .get(MascotaService.serverUrl + this.url + "/" + id, this.getRestHeader())
      .toPromise()
      .then(response => {
        return response.json() as Mascota;
      })
      .catch(this.handleError);
  }

  guardarMascota(value: Mascota): Promise<Mascota> {
    if (value._id) {
      return this.http
        .put(
          MascotaService.serverUrl + this.url + "/" + value._id,
          JSON.stringify(value),
          this.getRestHeader()
        )
        .toPromise()
        .then(response => {
          return response.json() as Mascota;
        })
        .catch(this.handleError);
    } else {
      return this.http
        .post(
          MascotaService.serverUrl + this.url,
          JSON.stringify(value),
          this.getRestHeader()
        )
        .toPromise()
        .then(response => {
          return response.json() as Mascota;
        })
        .catch(this.handleError);
    }
  }

  buscarImagen(id: string): Promise<Image> {
    return this.http
      .get(MascotaService.serverUrl + this.imagenUrl + "/" + id, this.getRestHeader())
      .toPromise()
      .then(response => {
        return response.json() as Image;
      })
      .catch(this.handleError);
  }

  guardarImagen(value: Image): Promise<Image> {
    return this.http
      .post(
      MascotaService.serverUrl + this.imagenUrl,
      JSON.stringify(value),
      this.getRestHeader()
      )
      .toPromise()
      .then(response => {
        return response.json() as Image;
      })
      .catch(this.handleError);
  }

  eliminarMascota(id: string): Promise<any> {
    if (id) {
      return this.http
        .delete(
          MascotaService.serverUrl + this.url + "/" + id,
          this.getRestHeader()
        )
        .toPromise()
        .then(response => {
          return "";
        })
        .catch(this.handleError);
    }
  }
}

export interface Mascota {
  _id: string;
  name: string;
  birthDate: string;
  description: string;
  image: string;
  imageBlob: Image;
}

