import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

const API_URL = 'https://dummyjson.com/users';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private clients: any[] = [];

  constructor(private http: HttpClient) {}

  /** Obtiene la lista de usuarios de la API */
  getClients(): Observable<any> {
    if (this.clients.length > 0) {
      return of({ users: this.clients });
    } else {
      return this.http.get<any>(API_URL).pipe(
        map(response => {
          this.clients = response.users;
          return { users: this.clients };
        })
      );
    }
  }

  /** Obtiene un cliente por su ID */
  getClientById(id: number): Observable<any> {
    const client = this.clients.find(c => c.id === id);
    return of(client);
  }

  /** Agrega un cliente (solo en memoria) */
  addClient(client: any): Observable<any> {
    client.id = this.clients.length + 1; // Genera un ID manualmente
    this.clients.push(client);
    return of(client);
  }

  /** Edita un cliente (solo en memoria) */
  updateClient(id: number, client: any): Observable<any> {
    const index = this.clients.findIndex(c => c.id === id);
    if (index !== -1) {
      this.clients[index] = { ...this.clients[index], ...client };
      return of(this.clients[index]);
    }
    return of(null);
  }

  /** Elimina un cliente (solo en memoria) */
  deleteClient(id: number): Observable<any> {
    this.clients = this.clients.filter(c => c.id !== id);
    return of({ message: 'Cliente eliminado' });
  }
}



