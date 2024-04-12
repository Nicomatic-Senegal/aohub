import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupportService {

  apiBaseUrl: string | undefined;

  constructor(private http: HttpClient) {
    this.apiBaseUrl = environment.apiBaseUrl;
  }

  sendMailToSupport(token: string, support: Object): Observable<void> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    const url = this.apiBaseUrl + 'partners/send-mail';

    return this.http.post<void>(url, support, { headers, responseType: 'json' });
  }
}
