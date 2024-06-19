import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

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

  allNotifications(token: string): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    const url = this.apiBaseUrl + `notifications/connected`;

    return this.http.get<any>(url, { headers, responseType: 'json' });
  }

  allUnreadNotifications(token: string): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    const url = this.apiBaseUrl + `notifications/count-unread`;

    return this.http.get<any>(url, { headers, responseType: 'json' });
  }

  markAllNotificationsAsRead(token: string): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    const url = this.apiBaseUrl + 'notifications/mark-all-as-read';

    return this.http.put<any>(url, { headers, responseType: 'json' })
  }

  markNotificaitonAsRead(token: string, notificationId: number): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    const url = this.apiBaseUrl + 'notification-settings/' + notificationId;

    return this.http.put<any>(url, { headers, responseType: 'json' })
  }
}
