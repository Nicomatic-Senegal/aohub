import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  apiBaseUrl: string | undefined;

  constructor(private http: HttpClient) {
    this.apiBaseUrl = environment.apiBaseUrl; 
  }

  getAllProjects(): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = this.apiBaseUrl + 'projects';

    return this.http.get<any>(url, { headers, responseType: 'json' });
  }
}
