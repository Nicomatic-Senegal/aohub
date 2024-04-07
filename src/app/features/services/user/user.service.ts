import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PartnerDTO } from '../../interfaces/partner.model';
import { environment } from 'src/environments/environment';
import { PartnerProfileVM } from '../../interfaces/partner-profile-vm.model';
import { PasswordChangeDTO } from '../../interfaces/password-dto.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  apiBaseUrl: string | undefined;

  constructor(private http: HttpClient) {
    this.apiBaseUrl = environment.apiBaseUrl;
   }

  getUser(token: string): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    const url = this.apiBaseUrl + 'partners/connected';
    return this.http.get<any>(url, { headers, responseType: 'json' });
  }

  updateUser(token: string, partner: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    const url = this.apiBaseUrl + 'partners/connected';
    return this.http.put<any>(url, partner, { headers, responseType: 'json' });
  }

  deletePicture(token: string, partner: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    const url = this.apiBaseUrl + 'partners/connected';
    return this.http.patch<any>(url, partner, { headers, responseType: 'json' });
  }

  changePassword(token: string, passwordDto: PasswordChangeDTO): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    const url = this.apiBaseUrl + 'account/change-password';
    return this.http.post<any>(url, passwordDto, { headers, responseType: 'json' });
  }
}
