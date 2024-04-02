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

  constructor(private router: Router) {
    this.baseUrl = 'http://inhub-platform-backend-service:8080/api/v1/';
    this.baseUrlAdmin = 'http://inhub-platform-backend-service:8080/api/admin/v1/';
  }

  getBaseUrl() {
    return this.baseUrl;
  }

  getBaseUrlAdmin() {
    return this.baseUrlAdmin;
  }

}
