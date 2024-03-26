import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { BaseAppService } from '../base-app/base-app.service';
import { ManagedUserVM } from '../../interfaces/managed-user-vm.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginVM } from '../../interfaces/login-vm.model';
import { KeyAndPasswordVM } from 'src/app/features/interfaces/key-and-password-vm.model';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  remainingSecondFromJWT!: number;
  token_timer: number;
  idle_timer: number;
  jwtHelper: JwtHelperService = new JwtHelperService();

  constructor(private route: Router, private http: HttpClient, private baseApp: BaseAppService) {

    this.token_timer = 50;
    this.idle_timer = 15;
   }

  authenticate(userLogged: LoginVM): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const baseUrl = this.baseApp.getBaseUrl();
    const url = baseUrl + 'authenticate';
    return this.http.post<any>(url, userLogged, { headers, responseType: 'json' });
  }

  register(userRegistered: ManagedUserVM): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const baseUrl = this.baseApp.getBaseUrl();
    const url = baseUrl + 'register';
    return this.http.post<any>(url, userRegistered, { headers, responseType: 'json' });
  }

  activateCompte(key: string): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const baseUrl = this.baseApp.getBaseUrl();
    const url = baseUrl + 'activate?key=' + key;
    return this.http.get<any>(url, { headers, responseType: 'json' });
  }

  requestPasswordReset(email: string): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const baseUrl = this.baseApp.getBaseUrl();
    const url = baseUrl + 'account/reset-password/init';
    return this.http.post<any>(url, email, { headers, responseType: 'json' });
  }

  finishPasswordReset(kpVM: KeyAndPasswordVM): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const baseUrl = this.baseApp.getBaseUrl();
    const url = baseUrl + 'account/reset-password/finish';
    return this.http.post<any>(url, kpVM, { headers, responseType: 'json' });
  }

  changePassword(kpVM: KeyAndPasswordVM): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const baseUrl = this.baseApp.getBaseUrl();
    const url = baseUrl + 'account/change-password';
    return this.http.post<any>(url, kpVM, { headers, responseType: 'json' });
  }


  checkAndRefreshToken(): Observable<any> {
    const token: string | null = localStorage.getItem('token');
    const expirationTime = this.getExpirationTimeFromToken(token);
    const currentTime = new Date().getTime();

    const threshold = 5 * 60 * 1000;
    //const threshold = 30000;

    if (expirationTime - currentTime <= threshold) {
      return this.refreshToken();
    } else {
      return of(null);
    }
  }

  refreshToken(): Observable<any> {
    const token: string | null = localStorage.getItem('token');
    console.log("Et voici le token: " + token);

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });

    const baseUrl = this.baseApp.getBaseUrl();
    const url = baseUrl + 'login/refresh_token';

    return this.http.post<any>(url, {}, { headers, responseType: 'json' });
  }

  getExpirationTimeFromToken(token: string | null): number {
    if (!token) {
      return 0;
    }
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      return 0;
    }
    const payload = JSON.parse(atob(tokenParts[1]));
    if (!payload || !payload.exp) {
      return 0;
    }
    return payload.exp * 1000;
  }

  loggedOut() {
    if (localStorage.getItem('token')) {

      const jwtToken = localStorage.getItem('token');

      if (typeof jwtToken == "string") {
        if (this.jwtHelper.isTokenExpired(jwtToken)) {
          localStorage.clear();
        }
      }

    }
    else {
      localStorage.clear();
    }
  }

  logOut() {
    let language = localStorage.getItem('language');
    localStorage.clear();
    if (typeof language == "string") {
      localStorage.setItem('language', language);
    }

    window.location.reload();
    this.route.navigate(['/signin']);
  }

  getRemainingSecondJWT() {
    return this.remainingSecondFromJWT;
  }

  isLogged() {
    if (!localStorage.getItem("token")) {
      this.route.navigate(['/signin']);
      return;
    }
    const item = localStorage.getItem("token");
    if (typeof item == "string") {
      return item;
    }
    return item;
  }

}
