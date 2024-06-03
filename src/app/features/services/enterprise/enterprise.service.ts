import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EnterpriseService {
  apiBaseUrl: string | undefined;

  constructor(private http: HttpClient) {
    this.apiBaseUrl = environment.apiBaseUrl; }

  getAllEnterprises(): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json'});
    const url = this.apiBaseUrl + 'enterprises';
    return this.http.get<any>(url, { headers, responseType: 'json' });
  }

  getEntrepriseById(enterpriseId: any, token: string): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    const url = this.apiBaseUrl + `enterprises/${enterpriseId}`;
    return this.http.get<any>(url, { headers, responseType: 'json' });
  }

  getAllEmployeePost(): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json'});
    const url = this.apiBaseUrl + 'employee-posts';
    return this.http.get<any>(url, { headers, responseType: 'json' });
  }
}
