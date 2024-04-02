import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginVM } from 'src/app/core/interfaces/login-vm.model';
import { BaseAppService } from 'src/app/core/services/base-app/base-app.service';

@Injectable({
  providedIn: 'root'
})
export class EnterpriseService {

  constructor(private http: HttpClient, private baseApp: BaseAppService) { }

  getAllEnterprises(): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const baseUrl = this.baseApp.getBaseUrl();
    const url = baseUrl + 'enterprises';
    console.log('register. baseurl: ' + baseUrl);
    return this.http.get<any>(url, { headers, responseType: 'json' });
  }
}
