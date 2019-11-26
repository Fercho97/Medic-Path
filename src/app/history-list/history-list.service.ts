import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

export class ConsultService{
    _urlListado : string = '';
    _urlIndividual : string = '';
    constructor(private _http: HttpClient) {
        this._urlListado = 'http://localhost:3000/historial/'
        this._urlIndividual = 'http://localhost:3000/historial/usuarioHist/'
        
    }


    historyList(user : any){
        return this._http.get(this._urlListado + user,
            {
              headers: new HttpHeaders()
              .set('Content-Type', 'application/x-www-form-urlencoded'),
              observe : 'response'
            },
        )
    }

    getHistory(id : any){
        return this._http.get(this._urlIndividual + encodeURIComponent(id),
            {
                headers: new HttpHeaders()
                .set('Content-Type', 'application/x-www-form-urlencoded'),
                observe : 'response' 
            }
        )
    }
}