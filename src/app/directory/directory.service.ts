import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from "@angular/core";

@Injectable()
export class DirectoryService {
  _urlDoctor: string = "";
  _urlAllDocs: string = "";
  constructor(private _http: HttpClient) {
    this._urlDoctor = "https://medicpath.herokuapp.com/usuarios/doctor/";
    //"http://localhost:3000/usuarios/doctor/";
    this._urlAllDocs = "https://medicpath.herokuapp.com/usuarios/doctorlist/";
    //"http://localhost:3000/usuarios/doctorlist/";

  }

  getDoctorInfo(hash: any){
    return this._http.get(this._urlDoctor + encodeURIComponent(hash), {
      headers: new HttpHeaders().set(
        "Content-Type",
        "application/x-www-form-urlencoded"
      ),
      observe: "response"
    });
  }

  getDoctors(tipo : any){
    return this._http.get(this._urlAllDocs + tipo, {
      headers: new HttpHeaders().set(
        "Content-Type",
        "application/x-www-form-urlencoded"
      ),
      observe: "response"
    });
  }
}