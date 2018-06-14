import { Injectable } from "@angular/core";
import { Http, Headers, Response, URLSearchParams } from "@angular/http";
import { RestBaseService } from "../tools/rest.tools";
import "rxjs/add/operator/toPromise";

@Injectable()
export class ProvinciaService extends RestBaseService {
  private provinciasUrl = "/province";

  constructor(private http: Http) {
    super();
  }

  getProvincias(): Promise<Provincia[]> {
    return this.http
      .get(
        ProvinciaService.serverUrl + this.provinciasUrl,
        this.getRestHeader()
      )
      .toPromise()
      .then(response => {
        return response.json() as Provincia[];
      })
      .catch(this.handleError);
  }
}

export interface Provincia {
  _id: string;
  name: string;
}
