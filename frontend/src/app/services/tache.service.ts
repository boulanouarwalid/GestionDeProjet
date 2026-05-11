import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tache, TacheDTO } from '../models/models';

@Injectable({ providedIn: 'root' })
export class TacheService {
  private api = 'http://localhost:8080/api/taches';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Tache[]> {
    return this.http.get<Tache[]>(this.api);
  }

  getByProjet(projetId: number): Observable<Tache[]> {
    return this.http.get<Tache[]>(`${this.api}/projet/${projetId}`);
  }

  create(projetId: number, dto: TacheDTO): Observable<Tache> {
    return this.http.post<Tache>(`${this.api}/${projetId}`, dto);
  }

  update(tacheId: number, dto: TacheDTO): Observable<Tache> {
    return this.http.put<Tache>(`${this.api}/${tacheId}`, dto);
  }

  delete(tacheId: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${tacheId}`);
  }
}
