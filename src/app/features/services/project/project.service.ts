import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Project } from '../../interfaces/project.model';
import { ProjectVM } from '../../interfaces/project-vm.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  apiBaseUrl: string | undefined;

  constructor(private http: HttpClient) {
    this.apiBaseUrl = environment.apiBaseUrl;
  }

  getAllProjects(token: string): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    const url = this.apiBaseUrl + 'projects';

    return this.http.get<any>(url, { headers, responseType: 'json' });
  }

  getAllDomains(token: string): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    const url = this.apiBaseUrl + 'domains';

    return this.http.get<any>(url, { headers, responseType: 'json' });
  }

  getAllMarkets(token: string): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    const url = this.apiBaseUrl + 'markets';

    return this.http.get<any>(url, { headers, responseType: 'json' });
  }

  addProject(token: string, project: ProjectVM): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    const url = this.apiBaseUrl + 'projects';

    return this.http.post<any>(url, project, { headers, responseType: 'json' });
  }
}
