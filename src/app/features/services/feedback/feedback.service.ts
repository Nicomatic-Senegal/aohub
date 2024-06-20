import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  apiBaseUrl: string | undefined;
  constructor(private http: HttpClient) {
    this.apiBaseUrl = environment.apiBaseUrl;
  }

  addFeedback(token: string, payload: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    const url = this.apiBaseUrl + 'feedbacks';

    return this.http.post<any>(url, payload, { headers, responseType: 'json' })
  }
}
