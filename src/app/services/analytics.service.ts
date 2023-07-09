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

  obtenerGraficoGeneral(data: any) {
    const url = 'http://localhost:8080/api/SocialFacebookGeneral';
    return this.http.post(url, data);
  }

  obtenerTotalReaccionesFecha(data: any) {
    const url = 'http://localhost:8080/api/TotalReaccionesPorFecha';
    return this.http.post(url, data);
  }

  obtenerTotalPublicacionesFecha(data: any) {
    const url = 'http://localhost:8080/api/TotalPublicacionesPorfecha';
    return this.http.post(url, data);
  }

  obtenerTotalComentarioFecha(data: any) {
    const url = 'http://localhost:8080/api/TotalComentarioPorFecha';
    return this.http.post(url, data);
  }

  obtenerTotalComentarioSentimiento(data: any) {
    const url = 'http://localhost:8080/api/TotalComentarioPorFecha';
    return this.http.post(url, data);
  }
}
