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
    const token: string | null = localStorage.getItem('token');
    let headers = new HttpHeaders({ 'Content-Type': 'application/json'});
    const url = this.apiBaseUrl + 'enterprises';
    console.log('register. baseurl: ' + this.apiBaseUrl);
    return this.http.get<any>(url, { headers, responseType: 'json' });
  }

  getAllEmployeePost(): Observable<any> {
    const token: string | null = localStorage.getItem('token');
    let headers = new HttpHeaders({ 'Content-Type': 'application/json'});
    const url = this.apiBaseUrl + 'employee-posts';
    console.log('register. baseurl: ' + this.apiBaseUrl);
    return this.http.get<any>(url, { headers, responseType: 'json' });
  }
}
