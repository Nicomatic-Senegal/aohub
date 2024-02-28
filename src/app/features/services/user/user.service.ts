import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseAppService } from 'src/app/core/services/base-app/base-app.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private baseApp: BaseAppService) { }

  getUser(token: string): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    const baseUrl = this.baseApp.getBaseUrlAdmin();
    const url = baseUrl + 'partners/connected';
    return this.http.get<any>(url, { headers, responseType: 'json' });
  }
}
