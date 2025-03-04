import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'https://dummyjson.com/users'; // Cambia esta URL con la correcta de tu API

  constructor(private http: HttpClient) {}

  getUsuarios(): Observable<any> {
    return this.http.get<any>(this.apiUrl); // Aquí obtenemos la respuesta completa de la API
  }
}
