import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class BaseAppService {


  baseUrl: string;
  baseUrlAdmin: string;
  //baseUrlUploadDemo: string;
  remainingSecondFromJWT!: number;
  token_timer: number;
  idle_timer: number;
  jwtHelper: JwtHelperService = new JwtHelperService();

  constructor(private router: Router) {
    this.baseUrl = 'http://localhost:8080/api/v1/';
    this.baseUrlAdmin = 'http://localhost:8080/api/admin/v1/';

    this.token_timer = 50;
    this.idle_timer = 15;
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

  getBaseUrl() {
    return this.baseUrl;
  }

  getBaseUrlAdmin() {
    return this.baseUrlAdmin;
  }

  logOut() {
    let language = localStorage.getItem('language');
    localStorage.clear();
    if (typeof language == "string") {
      localStorage.setItem('language', language);
    }

    window.location.reload();
    this.router.navigate(['/signin']);
  }

  getRemainingSecondJWT() {
    return this.remainingSecondFromJWT;
  }

}
