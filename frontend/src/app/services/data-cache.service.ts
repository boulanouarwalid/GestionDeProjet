import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { tap, shareReplay } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Projet, Tache, Depense, Budget } from '../models/models';

/**
 * Central cache service — every component subscribes to these streams.
 * Data is fetched once and shared; calling refresh() forces a new HTTP call
 * and pushes the result to all subscribers instantly.
 */
@Injectable({ providedIn: 'root' })
export class DataCacheService {

  private apiProjets  = 'http://localhost:8080/api/projets';
  private apiTaches   = 'http://localhost:8080/api/taches';
  private apiDepenses = 'http://localhost:8080/api/depenses';

  /* ── Streams ── */
  private _projets$  = new BehaviorSubject<Projet[]>([]);
  private _taches$   = new BehaviorSubject<Tache[]>([]);
  private _depenses$ = new BehaviorSubject<Depense[]>([]);
  private _loading$  = new BehaviorSubject<boolean>(false);

  readonly projets$  = this._projets$.asObservable();
  readonly taches$   = this._taches$.asObservable();
  readonly depenses$ = this._depenses$.asObservable();
  readonly loading$  = this._loading$.asObservable();

  /* Budget refresh trigger — any component can emit to signal budgets need reloading */
  private _budgetRefresh$ = new Subject<void>();
  readonly budgetRefresh$ = this._budgetRefresh$.asObservable();

  signalBudgetRefresh(): void { this._budgetRefresh$.next(); }

  /* Track whether initial load has happened */
  private loaded = false;

  constructor(private http: HttpClient) {}

  /** Call once at app startup (or on first component init). Subsequent calls are no-ops unless force=true. */
  init(force = false): void {
    if (this.loaded && !force) return;
    this.loaded = true;
    this._loading$.next(true);

    // Fire all three in parallel
    let pending = 3;
    const done = () => { if (--pending === 0) this._loading$.next(false); };

    this.http.get<Projet[]>(this.apiProjets).subscribe({
      next: d => { this._projets$.next(d); done(); },
      error: () => done()
    });
    this.http.get<Tache[]>(this.apiTaches).subscribe({
      next: d => { this._taches$.next(d); done(); },
      error: () => done()
    });
    this.http.get<Depense[]>(this.apiDepenses).subscribe({
      next: d => { this._depenses$.next(d); done(); },
      error: () => done()
    });
  }

  /** Force a full refresh of all data */
  refreshAll(): void { this.init(true); }

  /** Refresh only projets (after create/delete/clone) */
  refreshProjets(): void {
    this.http.get<Projet[]>(this.apiProjets).subscribe(d => this._projets$.next(d));
  }

  /** Refresh only taches (after create/update/delete) */
  refreshTaches(): void {
    this.http.get<Tache[]>(this.apiTaches).subscribe(d => this._taches$.next(d));
  }

  /** Refresh only depenses (after create/update/delete) */
  refreshDepenses(): void {
    this.http.get<Depense[]>(this.apiDepenses).subscribe(d => this._depenses$.next(d));
  }

  get depensesSnapshot(): Depense[] { return this._depenses$.getValue(); }

  get tachesSnapshot():  Tache[]   { return this._taches$.getValue(); }

  get projetsSnapshot(): Projet[]  { return this._projets$.getValue(); }

  /** Add a single task to the cache (optimistic UI update) */
  addTache(tache: Tache): void {
    const current = this._taches$.getValue();
    this._taches$.next([...current, tache]);
  }

  /** Add a single project to the cache (optimistic UI update) */
  addProjet(projet: Projet): void {
    const current = this._projets$.getValue();
    this._projets$.next([...current, projet]);
  }

  /** Add a single depense to the cache (optimistic UI update) */
  addDepense(depense: Depense): void {
    const current = this._depenses$.getValue();
    this._depenses$.next([...current, depense]);
  }

  addBudget(budget: Budget): void {
    // Budget cache not implemented yet — place for future _budgets$ subject
  }
}
