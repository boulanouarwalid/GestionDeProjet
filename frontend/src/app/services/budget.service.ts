import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Budget, BudgetDTO } from '../models/models';

@Injectable({ providedIn: 'root' })
export class BudgetService {
  private api = 'http://localhost:8080/api/budgets';

  constructor(private http: HttpClient) {}

  getByProjet(projetId: number): Observable<Budget[]> {
    return this.http.get<Budget[]>(`${this.api}/${projetId}`);
  }

  create(projetId: number, dto: BudgetDTO): Observable<Budget> {
    return this.http.post<Budget>(`${this.api}/${projetId}`, dto);
  }

  update(projetId: number, budgetId: number, dto: BudgetDTO): Observable<Budget> {
    return this.http.put<Budget>(`${this.api}/${projetId}/${budgetId}`, dto);
  }

  delete(budgetId: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${budgetId}`);
  }

  getTauxAvancement(projetId: number): Observable<number> {
    return this.http.get<number>(`${this.api}/avancement/${projetId}`);
  }
}
