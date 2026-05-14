import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DepenseService } from '../../services/depense.service';
import { TacheService } from '../../services/tache.service';
import { ProjetService } from '../../services/projet.service';
import { DataCacheService } from '../../services/data-cache.service';
import { Depense, DepenseDTO, Tache, Projet } from '../../models/models';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-depenses',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
<div class="page">

  <!-- Header -->
  <header class="page-header animate-in">
    <div>
      <div class="page-eyebrow"><span class="eyebrow-line"></span>Comptabilite</div>
      <h1 class="page-title">Depenses</h1>
      <p class="page-subtitle">Suivi des depenses par tache</p>
    </div>
    <div class="header-actions">
      <a routerLink="/depenses/detail" class="btn btn-ghost">
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
          <path d="M1 12h11M1 8h11M1 4h11M4 1v11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        Analyse Détaillée
      </a>
      <button class="btn btn-primary" (click)="showModal = true">
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
          <path d="M6.5 1.5V11.5M1.5 6.5H11.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        Nouvelle Depense
      </button>
    </div>
  </header>

  <!-- Filters + summary -->
  <div class="glass-panel filter-bar animate-in" style="animation-delay:0.05s">
    <div class="filter-group">
      <label>Projet</label>
      <select class="form-control" [(ngModel)]="selectedProjetId" (change)="onProjetChange()">
        <option [ngValue]="0">Tous les projets</option>
        @for (p of projets; track p.id) {
          <option [ngValue]="p.id">{{ p.nomProjet }}</option>
        }
      </select>
    </div>
    @if (taches.length > 0) {
      <div class="filter-group">
        <label>Tache</label>
        <select class="form-control" [(ngModel)]="selectedTacheId" (change)="loadDepenses()">
          <option [ngValue]="0">Toutes les taches</option>
          @for (t of taches; track t.id) {
            <option [ngValue]="t.id">{{ t.libelle }}</option>
          }
        </select>
      </div>
    }
    <div class="summary-block">
      <div class="summary-item">
        <span class="summary-label">Total</span>
        <span class="summary-value jade">{{ totalDepenses | number:'1.0-0' }} MAD</span>
      </div>
      <div class="summary-sep"></div>
      <div class="summary-item">
        <span class="summary-label">Entrees</span>
        <span class="summary-value azure">{{ depenses.length }}</span>
      </div>
    </div>
  </div>

  <!-- Table -->
  <div class="glass-panel table-wrap animate-in" style="animation-delay:0.1s">
    @if (depenses.length > 0) {
      <table class="data-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Description</th>
            <th>Montant</th>
            <th>Date</th>
            <th>Tache</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          @for (d of depenses; track d.id; let i = $index) {
            <tr class="table-row" [style.animation-delay]="(i * 0.03) + 's'">
              <td><span class="row-id">{{ d.id }}</span></td>
              <td>
                <div class="desc-cell">
                  <div class="desc-dot"></div>
                  {{ d.description || '—' }}
                </div>
              </td>
              <td>
                <span class="amount-badge">{{ d.montant | number:'1.0-0' }} <span class="amount-cur">MAD</span></span>
              </td>
              <td><span class="date-cell">{{ d.dateDepense || '—' }}</span></td>
              <td>
                @if (d.tache) {
                  <span class="badge badge-blue">{{ d.tache.libelle }}</span>
                } @else { <span style="color:var(--ink-5)">—</span> }
              </td>
              <td>
                <div class="row-actions">
                  <button class="btn btn-icon btn-ghost" (click)="editDepense(d)" title="Modifier">
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                      <path d="M9 2L11 4L4 11H2V9L9 2Z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/>
                    </svg>
                  </button>
                  <button class="btn btn-icon btn-ghost danger-hover" (click)="confirmDelete(d)" title="Supprimer">
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                      <path d="M2 4H11M4.5 4V3H8.5V4M5 6.5V9.5M8 6.5V9.5M2.5 4L3 10C3 10.6 3.4 11 4 11H9C9.6 11 10 10.6 10 10L10.5 4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          }
        </tbody>
      </table>
    } @else {
      <div class="empty-state">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" style="opacity:0.15;margin-bottom:12px">
          <circle cx="24" cy="24" r="20" stroke="white" stroke-width="2"/>
          <path d="M24 14V16M24 32V34M17 19C17 16.8 19.2 15 22 15H26C28.8 15 31 16.8 31 19C31 21.2 28.8 23 26 23H22C19.2 23 17 24.8 17 27C17 29.2 19.2 31 22 31H26C28.8 31 31 29.2 31 27" stroke="white" stroke-width="2" stroke-linecap="round"/>
        </svg>
        <div class="empty-state-text">Aucune depense trouvee</div>
      </div>
    }
  </div>

  <!-- Create / Edit Modal -->
  @if (showModal) {
    <div class="modal-overlay" (click)="closeModal()">
      <div class="modal-panel" (click)="$event.stopPropagation()">
        <div class="modal-icon violet">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <circle cx="9" cy="9" r="7" stroke="currentColor" stroke-width="1.5" fill="none"/>
            <path d="M9 5V6M9 12V13M6.5 7.5C6.5 6.67 7.17 6 8 6H10C10.83 6 11.5 6.67 11.5 7.5C11.5 8.33 10.83 9 10 9H8C7.17 9 6.5 9.67 6.5 10.5C6.5 11.33 7.17 12 8 12H10C10.83 12 11.5 11.33 11.5 10.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
          </svg>
        </div>
        <h2>{{ editing ? 'Modifier Depense' : 'Nouvelle Depense' }}</h2>
        @if (!editing) {
          <div class="form-group" style="margin-bottom:14px">
            <label>Tache</label>
            <select class="form-control" [(ngModel)]="modalTacheId">
              <option [ngValue]="0">-- Choisir une tache --</option>
              @for (t of allTaches; track t.id) {
                <option [ngValue]="t.id">{{ t.libelle }}</option>
              }
            </select>
          </div>
        }
        <div class="form-group" style="margin-bottom:14px">
          <label>Description</label>
          <input type="text" class="form-control" [(ngModel)]="form.description" placeholder="Description de la depense">
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Montant (MAD)</label>
            <input type="number" class="form-control" [(ngModel)]="form.montant" placeholder="1000">
          </div>
          <div class="form-group">
            <label>Date</label>
            <input type="date" class="form-control" [(ngModel)]="form.dateDepense">
          </div>
        </div>
        <div class="modal-actions">
          <button class="btn btn-ghost" (click)="closeModal()">Annuler</button>
          <button class="btn btn-primary" (click)="save()">{{ editing ? 'Modifier' : 'Creer' }}</button>
        </div>
      </div>
    </div>
  }

  <!-- Delete confirm -->
  @if (depenseToDelete) {
    <div class="modal-overlay" (click)="depenseToDelete = null">
      <div class="modal-panel confirm-panel" (click)="$event.stopPropagation()">
        <div class="modal-icon rose">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M9 3L16 15H2L9 3Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" fill="none"/>
            <path d="M9 8V11" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
            <circle cx="9" cy="13" r="0.8" fill="currentColor"/>
          </svg>
        </div>
        <h2>Supprimer cette Depense</h2>
        <p><strong>"{{ depenseToDelete.description || 'Depense #' + depenseToDelete.id }}"</strong> ({{ depenseToDelete.montant | number:'1.0-0' }} MAD)</p>
        <div class="modal-actions" style="justify-content:center">
          <button class="btn btn-ghost" (click)="depenseToDelete = null">Annuler</button>
          <button class="btn btn-danger" (click)="deleteDepense()">Supprimer</button>
        </div>
      </div>
    </div>
  }

  @if (toast) {
    <div class="toast-container">
      <div class="toast" [class]="'toast-' + toast.type">{{ toast.message }}</div>
    </div>
  }
</div>
  `,
  styles: [`
    .page-eyebrow { display:flex; align-items:center; gap:8px; font-size:0.68rem; font-weight:700; color:var(--ink-4); text-transform:uppercase; letter-spacing:0.1em; margin-bottom:5px; }
    .eyebrow-line { display:block; width:20px; height:2px; background:var(--g-aurora); border-radius:2px; }

    /* Filter bar */
    .filter-bar { display:flex; align-items:center; gap:20px; padding:14px 20px; margin-bottom:20px; flex-wrap:wrap; }
    .filter-group { display:flex; flex-direction:column; gap:5px; min-width:200px; }
    .filter-group label { font-size:0.68rem; font-weight:700; color:var(--ink-4); text-transform:uppercase; letter-spacing:0.08em; }

    /* Summary */
    .summary-block { margin-left:auto; display:flex; align-items:center; gap:16px; }
    .summary-item { display:flex; flex-direction:column; align-items:flex-end; gap:2px; }
    .summary-label { font-size:0.65rem; color:var(--ink-4); font-weight:600; text-transform:uppercase; letter-spacing:0.08em; }
    .summary-value { font-family:'Space Grotesk',sans-serif; font-size:1.2rem; font-weight:800; letter-spacing:-0.02em; }
    .summary-value.jade  { color:var(--a-jade); }
    .summary-value.azure { color:var(--a-azure); }
    .summary-sep { width:1px; height:32px; background:var(--glass-3); }

    /* Table */
    .table-wrap { overflow:hidden; }
    .table-row { animation:slideUp var(--dur-slow) var(--ease-out-expo) both; }
    .row-id { font-family:'Space Grotesk',sans-serif; font-size:0.72rem; color:var(--ink-4); font-weight:600; }
    .desc-cell { display:flex; align-items:center; gap:8px; font-weight:500; color:var(--ink-1); }
    .desc-dot { width:6px; height:6px; border-radius:50%; background:var(--a-violet); box-shadow:0 0 5px var(--a-violet); flex-shrink:0; }
    .amount-badge { font-family:'Space Grotesk',sans-serif; font-size:0.9rem; font-weight:700; color:var(--a-jade); }
    .amount-cur { font-size:0.72rem; color:var(--ink-4); font-weight:500; }
    .date-cell { font-size:0.8rem; color:var(--ink-4); font-family:'Space Grotesk',sans-serif; }
    .row-actions { display:flex; gap:3px; }
    .danger-hover:hover { color:var(--a-rose); }

    /* Modal */
    .modal-icon { width:42px; height:42px; border-radius:var(--r-md); display:flex; align-items:center; justify-content:center; margin-bottom:14px; }
    .modal-icon.violet { background:rgba(139,92,246,0.12); color:var(--a-violet); }
    .modal-icon.rose   { background:rgba(244,63,94,0.12);  color:var(--a-rose); }
    .confirm-panel p { color:var(--ink-3); font-size:0.88rem; margin-bottom:0; }
    .confirm-panel strong { color:var(--ink-1); }

    /* Header actions */
    .header-actions { display:flex; gap:12px; align-items:center; }
  `]
})
export class DepensesComponent implements OnInit, OnDestroy {
  projets: Projet[] = [];
  allTaches: Tache[] = [];   // full list for modal dropdown
  taches: Tache[] = [];      // filtered list for the tache filter dropdown
  depenses: Depense[] = [];
  selectedProjetId = 0;
  selectedTacheId = 0;
  get totalDepenses(): number { return this.depenses.reduce((s, d) => s + (d.montant || 0), 0); }

  showModal = false;
  editing: Depense | null = null;
  modalTacheId = 0;
  form: DepenseDTO = { montant: 0, description: '', dateDepense: '' };
  depenseToDelete: Depense | null = null;
  toast: { message: string; type: string } | null = null;
  private subs: Subscription[] = [];

  constructor(private depenseService: DepenseService, private tacheService: TacheService, private projetService: ProjetService, private cache: DataCacheService) {}

  ngOnInit() {
    // All three from cache — instant on revisit
    this.subs.push(this.cache.projets$.subscribe(p => this.projets = p));
    this.subs.push(this.cache.taches$.subscribe(t => { this.allTaches = t; this.taches = t; }));
    this.subs.push(this.cache.depenses$.subscribe(d => this.depenses = d));
    this.cache.init();
  }

  ngOnDestroy() { this.subs.forEach(s => s.unsubscribe()); }

  loadAllDepenses() { this.cache.refreshDepenses(); }

  onProjetChange() {
    this.selectedTacheId = 0;
    if (this.selectedProjetId > 0) {
      // Filter taches for the dropdown from the cached list
      this.taches = this.allTaches.filter(t => t.projet?.id === this.selectedProjetId);
    } else {
      this.taches = this.allTaches;
    }
    this.loadDepenses();
  }

  loadDepenses() {
    if (this.selectedTacheId > 0) {
      this.depenseService.getByTache(this.selectedTacheId).subscribe(d => this.depenses = d);
    } else if (this.selectedProjetId > 0) {
      // Filter from cache by projet
      this.depenses = this.cache.depensesSnapshot.filter(d => d.tache?.projet?.id === this.selectedProjetId);
    } else {
      this.depenses = this.cache.depensesSnapshot;
    }
  }

  editDepense(d: Depense) { this.editing = d; this.form = { montant: d.montant, description: d.description, dateDepense: d.dateDepense }; this.showModal = true; }
  closeModal() { this.showModal = false; this.editing = null; this.form = { montant: 0, description: '', dateDepense: '' }; this.modalTacheId = 0; }

  save() {
    if (this.editing) {
      this.depenseService.update(this.editing.id, this.form).subscribe({ next: () => { this.closeModal(); this.cache.refreshDepenses(); this.cache.signalBudgetRefresh(); this.showToast('Depense modifiee', 'success'); }, error: e => this.handleError(e) });
    } else {
      const tid = this.modalTacheId || this.selectedTacheId;
      if (!tid) { this.showToast('Choisissez une tache', 'error'); return; }
      this.depenseService.create(tid, this.form).subscribe({ next: () => { this.closeModal(); this.cache.refreshDepenses(); this.cache.signalBudgetRefresh(); this.showToast('Depense creee', 'success'); }, error: e => this.handleError(e) });
    }
  }

  confirmDelete(d: Depense) { this.depenseToDelete = d; }
  deleteDepense() {
    if (!this.depenseToDelete) return;
    this.depenseService.delete(this.depenseToDelete.id).subscribe({ next: () => { this.depenseToDelete = null; this.cache.refreshDepenses(); this.cache.signalBudgetRefresh(); this.showToast('Depense supprimee', 'success'); }, error: e => this.handleError(e) });
  }

  handleError(e: any) {
    const msg = e?.error?.errors ? Object.values(e.error.errors).join(', ') : e?.error?.message || (typeof e?.error === 'string' ? e.error : 'Une erreur est survenue');
    this.showToast(msg, 'error');
  }

  showToast(message: string, type: string) { this.toast = { message, type }; setTimeout(() => this.toast = null, 3000); }
}
