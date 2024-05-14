import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  apiBaseUrl: string | undefined;

  constructor(private http: HttpClient) { 
    this.apiBaseUrl = environment.apiBaseUrl;
  }

  getAllEvents(token: string): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    const url = this.apiBaseUrl + 'events';
    return this.http.get<any>(url, { headers, responseType: 'json' });
  }

  addEvent(token: string, payload: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    const url = this.apiBaseUrl + 'events';
    return this.http.post<any>(url, payload, { headers, responseType: 'json' });
  }

}
