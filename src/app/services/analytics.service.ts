import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  constructor(private http: HttpClient) {}

  obtenerPaginas(access_token: string) {
    const url = `https://graph.facebook.com/v12.0/me/accounts?access_token=${access_token}`;
    return this.http.get(url);
  }

  obtenerPosts(access_token: string) {
    const url = ` https://graph.facebook.com/v12.0/me/posts?access_token=${access_token}`;
    return this.http.get(url);
  }
}
