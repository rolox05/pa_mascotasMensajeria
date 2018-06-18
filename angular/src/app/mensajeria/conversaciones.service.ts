import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import { RestBaseService } from "../tools/rest.tools";
import "rxjs/add/operator/toPromise";
import { Usuario } from "../usuario/usuario.service";
import { ConversationDTO } from "./mensajeria.component";

@Injectable()
export class ConversacionService extends RestBaseService {
  private url = "/conversaciones";

  constructor(private http: Http) {
    super();
  }

  getAll(): Promise<Conversacion[]> {
    return this.http
      .get(ConversacionService.serverUrl + this.url, this.getRestHeader())
      .toPromise()
      .then(response => {
        return response.json() as Conversacion[];
      })
      .catch(this.handleError);
  }

  iniciarConversacion(dto: ConversationDTO): Promise<Conversacion> {
      return this.http
        .post(ConversacionService.serverUrl + this.url,
        JSON.stringify(dto),
        this.getRestHeader())
        .toPromise()
        .then(response => {
            return response.json() as Conversacion;
        })
        .catch(this.handleError);
  }
}

export interface Conversacion {
    user: String;
    target: String;
    updated: Date;
    created: Date;
    enabled: Boolean;
}

