import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {map, Observable} from 'rxjs';
import { environment } from 'src/environments/environment';
import {Project} from "../../interfaces/project.model";
import {Notification} from "../../interfaces/notification-dto.model";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  apiBaseUrl: string | undefined;

  constructor(private http: HttpClient) {
    this.apiBaseUrl = environment.apiBaseUrl;
  }

  setSetting(token: string, payload: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    const url = this.apiBaseUrl + 'notification-settings';

    return this.http.post<any>(url, payload, { headers, responseType: 'json' })
  }

  updateSetting(token: string, payload: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    const url = this.apiBaseUrl + 'notification-settings/' + payload.id;

    return this.http.put<any>(url, payload, { headers, responseType: 'json' })
  }

  allNotifications(token: string, page: number, size: number): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    const url = `${this.apiBaseUrl}notifications/connected?page=${page}&size=${size}&sort=id,desc`;

    return this.http.get<any>(url, { headers, responseType: 'json', observe: 'response' })
      .pipe(
        map(response => {
          const totalCountHeader = response.headers.get('X-Total-Count');
          const totalCount = totalCountHeader ? parseInt(totalCountHeader, 10) : 0;
          const notifications = response.body;
          return { notifications, totalCount };
        })
      );
  }

  allUnreadNotifications(token: string): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    const url = this.apiBaseUrl + `notifications/count-unread`;

    return this.http.get<any>(url, { headers, responseType: 'json' });
  }

  markAllNotificationsAsRead(token: string): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    const url = this.apiBaseUrl + 'notifications/mark-all-as-read';

    return this.http.put<any>(url, {}, { headers, responseType: 'json' })
  }

  markNotificationAsRead(token: string, notificationId: number): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    console.log(token);

    const url = this.apiBaseUrl + 'notifications/mark-as-read/' + notificationId;

    return this.http.put<any>(url, {}, { headers, responseType: 'json' })
  }

  searchNotifications(token: string, query: string, page: number, size: number): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    const url = this.apiBaseUrl + 'notifications/_search?query=' + query + `&page=${page}&size=${size}&sort=id,desc`;

    return this.http.get<Notification>(url, { headers, responseType: 'json', observe: 'response' })
      .pipe(
        map(response => {
          const totalCountHeader = response.headers.get('X-Total-Count');
          const totalCount = totalCountHeader ? parseInt(totalCountHeader, 10) : 0;
          const notifications = response.body;
          return { notifications, totalCount };
        })
      );
  }
}
