import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Depense, DepenseDTO } from '../models/models';

@Injectable({ providedIn: 'root' })
export class DepenseService {
  private api = 'http://localhost:8080/api/depenses';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Depense[]> {
    return this.http.get<Depense[]>(this.api);
  }

  getByTache(tacheId: number): Observable<Depense[]> {
    return this.http.get<Depense[]>(`${this.api}/tache/${tacheId}`);
  }

  create(tacheId: number, dto: DepenseDTO): Observable<Depense> {
    return this.http.post<Depense>(`${this.api}/create/${tacheId}`, dto);
  }

  update(depenseId: number, dto: DepenseDTO): Observable<Depense> {
    return this.http.put<Depense>(`${this.api}/${depenseId}`, dto);
  }

  delete(depenseId: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${depenseId}`);
  }
}
