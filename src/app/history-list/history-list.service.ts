import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

export class ConsultService{
    _urlListado : string = '';
    _urlIndividual : string = '';
    constructor(private _http: HttpClient) {
        this._urlListado = //"https://medicpath.herokuapp.com/historial/"
        'http://localhost:3000/historial/'
        this._urlIndividual = //"https://medicpath.herokuapp.com/historial/usuarioHist/"
        'http://localhost:3000/historial/usuarioHist/'
        
    }


    historyList(user : any, token : any){
        const headers = new HttpHeaders({'Authorization': token, 'Content-Type':'application/x-www-form-urlencoded', 'X-Requested-With':'XMLHttpRequest'});
        
        return this._http.get(this._urlListado + user,
            {
              headers: headers,
              observe : 'response'
            },
        )
    }

    getHistory(id : any, token : any){
        const headers = new HttpHeaders({'Authorization': token, 'Content-Type':'application/x-www-form-urlencoded', 'X-Requested-With':'XMLHttpRequest'});
        
        return this._http.get(this._urlIndividual + encodeURIComponent(id),
            {
                headers: headers,
                observe : 'response' 
            }
        )
    }
}