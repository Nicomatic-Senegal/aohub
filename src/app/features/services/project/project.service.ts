import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Project } from '../../interfaces/project.model';
import { ProjectVM } from '../../interfaces/project-vm.model';
import { AttachmentDto } from '../../interfaces/attachment-dto.model';
import { PositioningDTO } from '../../interfaces/positioning-dto.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  apiBaseUrl: string | undefined;

  constructor(private http: HttpClient) {
    this.apiBaseUrl = environment.apiBaseUrl;
  }

  getAllProjects(token: string, page: number, size: number): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    const url = `${this.apiBaseUrl}projects?page=${page}&size=${size}&sort=id,desc`;

    return this.http.get<Project[]>(url, { headers, responseType: 'json', observe: 'response' })
      .pipe(
        map(response => {
          const totalCountHeader = response.headers.get('X-Total-Count');
          const totalCount = totalCountHeader ? parseInt(totalCountHeader, 10) : 0;
          const projects = response.body;
          return { projects, totalCount };
        })
      );
  }

  getMyProjects(token: string, page: number, size: number): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    const url = `${this.apiBaseUrl}projects/my-participations?page=${page}&size=${size}&sort=id,desc`;

    return this.http.get<Project[]>(url, { headers, responseType: 'json', observe: 'response' })
      .pipe(
        map(response => {
          const totalCountHeader = response.headers.get('X-Total-Count');
          const totalCount = totalCountHeader ? parseInt(totalCountHeader, 10) : 0;
          const projects = response.body;
          return { projects, totalCount };
        })
      );
  }

  getProjectById(token: string, projectId: string): Observable<Project> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    const url = this.apiBaseUrl + `projects/${projectId}`;

    return this.http.get<Project>(url, { headers, responseType: 'json' });
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

  positioning(token: string, payload: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    const url = this.apiBaseUrl + 'positionings';

    return this.http.post<any>(url, payload, { headers, responseType: 'json' })
  }

  addProject(token: string, project: ProjectVM): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    const url = this.apiBaseUrl + 'projects';

    return this.http.post<any>(url, project, { headers, responseType: 'json' });
  }

  getAllMyProjects(token: string): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    const url = this.apiBaseUrl + 'projects/my-projects?sort=id,desc';

    return this.http.get<any>(url, { headers, responseType: 'json' });
  }

  getPartnersInMyProjectsFiltred(token: string, idProject: number): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    const url = this.apiBaseUrl + 'positionings/project/' + idProject;

    return this.http.get<any>(url, { headers, responseType: 'json' });
  }

  getPartnersInMyProjects(token: string, idProject: number): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    const url = this.apiBaseUrl + 'positionings/project/' + idProject + '/all';

    return this.http.get<any>(url, { headers, responseType: 'json' });
  }

  addProjectAttachments(token: string, attachments: AttachmentDto): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    const url = this.apiBaseUrl + 'attachments';

    return this.http.post<any>(url, attachments, { headers, responseType: 'json' });
  }

  searchProject(token: string, query: string): Observable<Project> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    const url = this.apiBaseUrl + `projects/search-engine`;

    return this.http.get<Project>(url, { headers, params: {'query': query} });
  }

  validatePositioning(token: string, idPos: number): Observable<Project> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    const url = this.apiBaseUrl + `positionings/validate/${idPos}`;

    return this.http.get<Project>(url, { headers, responseType: 'json' });
  }

  rejectPositioning(token: string, idPos: number): Observable<Project> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    const url = this.apiBaseUrl + `positionings/reject/${idPos}`;

    return this.http.get<Project>(url, { headers, responseType: 'json' });
  }

  extendDeadlineForOpportunity(token: string, payload: Object, id: number): Observable<void> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    const url = this.apiBaseUrl + `projects/${id}`;

    return this.http.patch<void>(url, payload, { headers, responseType: 'json' });
  }

  isTeamMember(token: string, projectId: number): Observable<PositioningDTO[]> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    const url = this.apiBaseUrl + `positionings/project/${projectId}/all`;

    return this.http.get<PositioningDTO[]>(url, { headers, responseType: 'json' });
  }

  deleteProject(token: string, projectId: number, reasonToSend: string): Observable<void> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    const url = this.apiBaseUrl + `projects/${projectId}`;
    const requestBody = {id:projectId, reason: reasonToSend };

    return this.http.delete<void>(url, {headers, body: requestBody, responseType: 'json'});
  }
}
