import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
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

  genererRapport(id: number, format: string = 'rapportExcelService'): Observable<Blob> {
    const params = new HttpParams().set('format', format);
    return this.http.post(`${this.api}/${id}/generer-rapport`, {}, { params, responseType: 'blob' });
  }

  initialiser(request: InitProjetRequest): Observable<Projet> {
    return this.http.post<Projet>(`${this.api}/initialiser`, request);
  }
}
