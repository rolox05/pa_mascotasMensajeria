import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Rx";
import { Http, Headers, Response, RequestOptions } from "@angular/http";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import { environment } from "../../environments/environment";

export class RestBaseService {
  public static serverUrl = environment.serverBase;

  protected handleError(error: Response | any) {
    /*    if (error && (error.status == 401 || error.status == 0) && window.location.pathname != "/") {
          window.location.assign(RestBaseService.serverUrl);
        }*/

    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || "";
      return Promise.reject(body);
    } else {
      errMsg = error.message ? error.message : error.toString();
      return Promise.reject(errMsg);
    }
  }

  protected getRestHeader(): RequestOptions {
    const headers = new Headers({
      "Content-Type": "application/json",
      "Authorization": "bearer " + localStorage.getItem("auth_token")
    });
    const options = new RequestOptions({ headers: headers, withCredentials: true });
    return options;
  }
}
