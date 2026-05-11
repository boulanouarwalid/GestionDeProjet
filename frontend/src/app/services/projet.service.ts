import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Projet, ProjetDTO, InitProjetRequest } from '../models/models';

@Injectable({ providedIn: 'root' })
export class ProjetService {
  private api = 'http://localhost:8080/api/projets';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Projet[]> {
    return this.http.get<Projet[]>(this.api);
  }

  getById(id: number): Observable<Projet> {
    return this.http.get<Projet>(`${this.api}/${id}`);
  }

  create(dto: ProjetDTO): Observable<Projet> {
    return this.http.post<Projet>(this.api, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }

  cloner(id: number): Observable<Projet> {
    return this.http.post<Projet>(`${this.api}/${id}/cloner`, {});
  }

  genererRapport(id: number): Observable<string> {
    return this.http.post(`${this.api}/${id}/generer-rapport`, {}, { responseType: 'text' });
  }

  initialiser(request: InitProjetRequest): Observable<Projet> {
    return this.http.post<Projet>(`${this.api}/initialiser`, request);
  }
}
