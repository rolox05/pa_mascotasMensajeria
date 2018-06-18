import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import { RestBaseService } from "../tools/rest.tools";
import "rxjs/add/operator/toPromise";
import { Conversacion } from "./conversaciones.service";

@Injectable()
export class MensajeService extends RestBaseService {
  private url = "/mensaje";

  constructor(private http: Http) {
    super();
  }

  getAll(conversacion: Conversacion): Promise<Mensaje[]> {
    return this.http
      .get(MensajeService.serverUrl + this.url + "/" + conversacion.target + "/" + conversacion.user, this.getRestHeader())
      .toPromise()
      .then(response => {
        return response.json() as Mensaje[];
      })
      .catch(this.handleError);
  }

  enviarMensaje(mensaje: Mensaje) {
    return this.http
        .post(MensajeService.serverUrl + this.url + "/" + mensaje.target + "/" + mensaje.user,
        JSON.stringify(mensaje),
        this.getRestHeader())
        .toPromise()
        .then(response => {
            return response.json() as Mensaje[];
        })
        .catch(this.handleError);
  }

  deleteMessage(mensaje: Mensaje) {
    return this.http
        .delete(MensajeService.serverUrl + this.url + "/" + mensaje._id,
        this.getRestHeader())
        .toPromise()
        .then(response => {
            return response;
        })
        .catch(this.handleError);
  }
}

export interface Mensaje {
    _id: String;
    user: String;
    target: String;
    fromUserName: String;
    mensaje: String;
    created: Date;
}

