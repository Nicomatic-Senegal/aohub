import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PartnerDTO } from '../../interfaces/partner.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PartnerService {
  apiBaseUrl: string | undefined;

  constructor(private http: HttpClient) {
    this.apiBaseUrl = environment.apiBaseUrl;
  }

  getPartnerById( id: number, token: string): Observable<PartnerDTO> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    const url = this.apiBaseUrl + `partners/${id}`;

    return this.http.get<PartnerDTO>(url, { headers, responseType: 'json' });
  }

  searchPartner(token: string, query: string): Observable<PartnerDTO> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    const url = this.apiBaseUrl + `partners/search-engine`;

    return this.http.get<PartnerDTO>(url, { headers, params: {'query': query} });
  }
}
