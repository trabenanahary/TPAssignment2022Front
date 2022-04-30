import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})

export class MatieresService {
    private localProtocol = "http"
    private localPort = ":8010"
    // url = (document.domain.startsWith("localhost") ? this.localProtocol : "https")+"://"+ document.domain + (document.domain.startsWith("localhost") ? this.localPort : "")+"/api"
    private url = "https://tpmbdsmadagascarback.herokuapp.com/api";

    constructor(private http: HttpClient){}

    public getMatiereComplete() {
        console.log("dans matiere complete");

        return this.http.get(this.url + "/matieresComplete");
      }
}