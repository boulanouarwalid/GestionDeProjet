import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BudgetService } from '../../services/budget.service';
import { ProjetService } from '../../services/projet.service';
import { DataCacheService } from '../../services/data-cache.service';
import { Budget, BudgetDTO, Projet } from '../../models/models';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-budgets',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
<div class="page">

  <!-- Header -->
  <header class="page-header animate-in">
    <div>
      <div class="page-eyebrow"><span class="eyebrow-line"></span>Financier</div>
      <h1 class="page-title">Budgets</h1>
      <p class="page-subtitle">Suivi budgetaire de vos projets</p>
    </div>
    <button class="btn btn-primary" (click)="showModal = true">
      <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
        <path d="M6.5 1.5V11.5M1.5 6.5H11.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
      Nouveau Budget
    </button>
  </header>

  <!-- Filter bar -->
  <div class="glass-panel filter-bar animate-in" style="animation-delay:0.05s">
    <div class="filter-group">
      <label>Projet</label>
      <select class="form-control" [(ngModel)]="selectedProjetId" (change)="loadBudgets()">
        <option [ngValue]="0">-- Choisir un projet --</option>
        @for (p of projets; track p.id) {
          <option [ngValue]="p.id">{{ p.nomProjet }}</option>
        }
      </select>
    </div>
    @if (selectedProjetId > 0) {
      <div class="avancement-pill" [class.jade]="avancement < 60" [class.amber]="avancement >= 60 && avancement < 85" [class.rose]="avancement >= 85">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M6 1L7.5 4.5L11 5L8.5 7.5L9 11L6 9.5L3 11L3.5 7.5L1 5L4.5 4.5L6 1Z" fill="currentColor" opacity="0.8"/>
        </svg>
        Avancement: <strong>{{ avancement | number:'1.1-1' }}%</strong>
      </div>
    }
  </div>

  <!-- Budget cards -->
  @if (selectedProjetId > 0) {
    @if (budgets.length > 0) {
      <div class="budgets-grid">
        @for (b of budgets; track b.id; let i = $index) {
          <div class="budget-card glass-panel animate-in" [style.animation-delay]="(i * 0.05) + 's'">
            <div class="card-top-line" [style.background]="getCardColor(i)"></div>

            <div class="card-header">
              <span class="badge badge-emerald">{{ b.categorie }}</span>
              <div class="card-actions">
                <button class="btn btn-icon btn-ghost" (click)="editBudget(b)" title="Modifier">
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                    <path d="M9 2L11 4L4 11H2V9L9 2Z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/>
                  </svg>
                </button>
                <button class="btn btn-icon btn-ghost danger-hover" (click)="confirmDelete(b)" title="Supprimer">
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                    <path d="M2 4H11M4.5 4V3H8.5V4M5 6.5V9.5M8 6.5V9.5M2.5 4L3 10C3 10.6 3.4 11 4 11H9C9.6 11 10 10.6 10 10L10.5 4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>

            <div class="card-amount">
              {{ b.montantPrevu | number:'1.0-0' }}
              <span class="currency">MAD</span>
            </div>
            <div class="card-consumed">
              Consomme: <strong>{{ (b.montantConsomme || 0) | number:'1.0-0' }} MAD</strong>
            </div>

            <div class="card-progress">
              <div class="progress-bar-track">
                <div class="progress-bar-fill"
                     [class.success]="getConsumptionPercent(b) < 60"
                     [class.warning]="getConsumptionPercent(b) >= 60 && getConsumptionPercent(b) < 85"
                     [class.danger]="getConsumptionPercent(b) >= 85"
                     [style.width.%]="getConsumptionPercent(b)"></div>
              </div>
              <span class="progress-pct" [class.jade]="getConsumptionPercent(b) < 60" [class.amber]="getConsumptionPercent(b) >= 60 && getConsumptionPercent(b) < 85" [class.rose]="getConsumptionPercent(b) >= 85">
                {{ getConsumptionPercent(b) | number:'1.0-0' }}%
              </span>
            </div>
          </div>
        }
      </div>
    } @else {
      <div class="glass-panel empty-state animate-in">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" style="opacity:0.15;margin-bottom:12px">
          <rect x="4" y="12" width="40" height="28" rx="5" stroke="white" stroke-width="2"/>
          <path d="M4 20H44" stroke="white" stroke-width="1.5"/>
          <rect x="10" y="28" width="10" height="4" rx="2" fill="white" opacity="0.5"/>
          <circle cx="36" cy="30" r="4" fill="white" opacity="0.5"/>
        </svg>
        <div class="empty-state-text">Aucun budget pour ce projet</div>
        <button class="btn btn-primary" (click)="showModal = true">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 2V10M2 6H10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
          </svg>
          Ajouter un Budget
        </button>
      </div>
    }
  } @else {
    <div class="glass-panel empty-state animate-in">
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" style="opacity:0.15;margin-bottom:12px">
        <path d="M6 18C6 15.8 7.8 14 10 14H22L26 18H42C44.2 18 46 19.8 46 22V40C46 42.2 44.2 44 42 44H10C7.8 44 6 42.2 6 40V18Z" stroke="white" stroke-width="2"/>
      </svg>
      <div class="empty-state-text">Selectionnez un projet pour voir ses budgets</div>
    </div>
  }

  <!-- Create / Edit Modal -->
  @if (showModal) {
    <div class="modal-overlay" (click)="closeModal()">
      <div class="modal-panel" (click)="$event.stopPropagation()">
        <div class="modal-icon jade">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <rect x="1" y="4" width="16" height="12" rx="2.5" fill="currentColor" opacity="0.8"/>
            <path d="M1 8H17" stroke="rgba(255,255,255,0.3)" stroke-width="1"/>
          </svg>
        </div>
        <h2>{{ editing ? 'Modifier Budget' : 'Nouveau Budget' }}</h2>
        @if (!editing) {
          <div class="form-group" style="margin-bottom:14px">
            <label>Projet</label>
            <select class="form-control" [(ngModel)]="modalProjetId">
              <option [ngValue]="0">-- Choisir --</option>
              @for (p of projets; track p.id) {
                <option [ngValue]="p.id">{{ p.nomProjet }}</option>
              }
            </select>
          </div>
        }
        <div class="form-group" style="margin-bottom:14px">
          <label>Categorie</label>
          <input type="text" class="form-control" [(ngModel)]="form.categorie" placeholder="Ex: Infrastructure, RH, Cloud...">
        </div>
        <div class="form-group">
          <label>Montant Prevu (MAD)</label>
          <input type="number" class="form-control" [(ngModel)]="form.montantPrevu" placeholder="50000">
        </div>
        <div class="modal-actions">
          <button class="btn btn-ghost" (click)="closeModal()">Annuler</button>
          <button class="btn btn-primary" (click)="save()">{{ editing ? 'Modifier' : 'Creer' }}</button>
        </div>
      </div>
    </div>
  }

  <!-- Delete confirm -->
  @if (budgetToDelete) {
    <div class="modal-overlay" (click)="budgetToDelete = null">
      <div class="modal-panel confirm-panel" (click)="$event.stopPropagation()">
        <div class="modal-icon rose">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M9 3L16 15H2L9 3Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" fill="none"/>
            <path d="M9 8V11" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
            <circle cx="9" cy="13" r="0.8" fill="currentColor"/>
          </svg>
        </div>
        <h2>Supprimer ce Budget</h2>
        <p><strong>"{{ budgetToDelete.categorie }}"</strong> ({{ budgetToDelete.montantPrevu | number:'1.0-0' }} MAD) sera supprime.</p>
        <div class="modal-actions" style="justify-content:center">
          <button class="btn btn-ghost" (click)="budgetToDelete = null">Annuler</button>
          <button class="btn btn-danger" (click)="deleteBudget()">Supprimer</button>
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
    .filter-bar { display:flex; align-items:center; gap:20px; padding:14px 20px; margin-bottom:24px; flex-wrap:wrap; }
    .filter-group { display:flex; flex-direction:column; gap:5px; min-width:220px; }
    .filter-group label { font-size:0.68rem; font-weight:700; color:var(--ink-4); text-transform:uppercase; letter-spacing:0.08em; }

    .avancement-pill { display:inline-flex; align-items:center; gap:7px; padding:7px 14px; border-radius:var(--r-full); font-size:0.8rem; font-weight:500; border:1px solid; }
    .avancement-pill.jade  { background:rgba(16,185,129,0.08);  color:var(--a-jade);  border-color:rgba(16,185,129,0.2); }
    .avancement-pill.amber { background:rgba(245,158,11,0.08);  color:var(--a-amber); border-color:rgba(245,158,11,0.2); }
    .avancement-pill.rose  { background:rgba(244,63,94,0.08);   color:var(--a-rose);  border-color:rgba(244,63,94,0.2); }
    .avancement-pill strong { font-weight:700; }

    /* Grid */
    .budgets-grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(280px,1fr)); gap:18px; }

    /* Card */
    .budget-card { padding:22px; position:relative; overflow:hidden; transition:all var(--dur-slow) var(--ease-out-expo); }
    .budget-card:hover { transform:translateY(-4px); border-color:var(--glass-4); box-shadow:var(--shadow-lg); }
    .card-top-line { position:absolute; top:0; left:0; right:0; height:2px; }
    .card-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; }
    .card-actions { display:flex; gap:3px; }
    .danger-hover:hover { color:var(--a-rose); }
    .card-amount { font-family:'Space Grotesk',sans-serif; font-size:2rem; font-weight:800; letter-spacing:-0.03em; color:var(--ink-0); margin-bottom:3px; }
    .currency { font-size:0.85rem; color:var(--ink-4); font-weight:500; }
    .card-consumed { font-size:0.78rem; color:var(--ink-4); margin-bottom:14px; }
    .card-consumed strong { color:var(--ink-2); }
    .card-progress { display:flex; align-items:center; gap:10px; }
    .card-progress .progress-bar-track { flex:1; }
    .progress-pct { font-size:0.72rem; font-weight:700; white-space:nowrap; }
    .progress-pct.jade  { color:var(--a-jade); }
    .progress-pct.amber { color:var(--a-amber); }
    .progress-pct.rose  { color:var(--a-rose); }

    /* Modal */
    .modal-icon { width:42px; height:42px; border-radius:var(--r-md); display:flex; align-items:center; justify-content:center; margin-bottom:14px; }
    .modal-icon.jade { background:rgba(16,185,129,0.12); color:var(--a-jade); }
    .modal-icon.rose { background:rgba(244,63,94,0.12);  color:var(--a-rose); }
    .confirm-panel p { color:var(--ink-3); font-size:0.88rem; margin-bottom:0; }
    .confirm-panel strong { color:var(--ink-1); }
  `]
})
export class BudgetsComponent implements OnInit, OnDestroy {
  projets: Projet[] = [];
  budgets: Budget[] = [];
  selectedProjetId = 0;
  avancement = 0;
  showModal = false;
  editing: Budget | null = null;
  modalProjetId = 0;
  form: BudgetDTO = { montantPrevu: 0, categorie: '' };
  budgetToDelete: Budget | null = null;
  toast: { message: string; type: string } | null = null;
  private subs: Subscription[] = [];

  cardColors = [
    'linear-gradient(90deg,#4f8fff,#2563eb)',
    'linear-gradient(90deg,#8b5cf6,#6d28d9)',
    'linear-gradient(90deg,#10b981,#059669)',
    'linear-gradient(90deg,#f59e0b,#d97706)',
    'linear-gradient(90deg,#f43f5e,#e11d48)',
  ];

  constructor(private budgetService: BudgetService, private projetService: ProjetService, private cache: DataCacheService) {}

  ngOnInit() {
    // Subscribe to projects from cache
    this.subs.push(this.cache.projets$.subscribe(projets => {
      this.projets = projets;
      if (projets.length > 0 && this.selectedProjetId === 0) {
        this.selectedProjetId = projets[0].id;
        this.loadBudgets();
      }
    }));
    // Auto-refresh when budget data changes (e.g. depense created/deleted)
    this.subs.push(this.cache.budgetRefresh$.subscribe(() => {
      this.loadBudgets();
    }));
    this.cache.init();
  }

  ngOnDestroy() { this.subs.forEach(s => s.unsubscribe()); }

  loadBudgets() {
    if (this.selectedProjetId <= 0) { this.budgets = []; return; }
    this.budgetService.getByProjet(this.selectedProjetId).subscribe(b => this.budgets = b);
    this.budgetService.getTauxAvancement(this.selectedProjetId).subscribe({ next: v => this.avancement = v, error: () => this.avancement = 0 });
  }

  getConsumptionPercent(b: Budget): number {
    if (!b.montantPrevu || b.montantPrevu <= 0) return 0;
    return Math.min(((b.montantConsomme || 0) / b.montantPrevu) * 100, 100);
  }

  getCardColor(i: number): string { return this.cardColors[i % this.cardColors.length]; }

  editBudget(b: Budget) { this.editing = b; this.form = { montantPrevu: b.montantPrevu, categorie: b.categorie }; this.modalProjetId = this.selectedProjetId; this.showModal = true; }
  closeModal() { this.showModal = false; this.editing = null; this.form = { montantPrevu: 0, categorie: '' }; this.modalProjetId = 0; }

  save() {
    const pid = this.editing ? this.selectedProjetId : (this.modalProjetId || this.selectedProjetId);
    if (!pid) { this.showToast('Choisissez un projet', 'error'); return; }
    if (this.editing) {
      this.budgetService.update(pid, this.editing.id, this.form).subscribe({ next: () => { this.closeModal(); this.loadBudgets(); this.cache.refreshProjets(); this.showToast('Budget modifie', 'success'); }, error: e => this.handleError(e) });
    } else {
      this.budgetService.create(pid, this.form).subscribe({ next: () => { this.closeModal(); if (this.selectedProjetId === pid) this.loadBudgets(); this.cache.refreshProjets(); this.showToast('Budget cree', 'success'); }, error: e => this.handleError(e) });
    }
  }

  confirmDelete(b: Budget) { this.budgetToDelete = b; }
  deleteBudget() {
    if (!this.budgetToDelete) return;
    this.budgetService.delete(this.budgetToDelete.id).subscribe({ next: () => { this.budgetToDelete = null; this.loadBudgets(); this.cache.refreshProjets(); this.showToast('Budget supprime', 'success'); }, error: e => this.handleError(e) });
  }

  handleError(e: any) {
    const msg = e?.error?.errors ? Object.values(e.error.errors).join(', ') : e?.error?.message || (typeof e?.error === 'string' ? e.error : 'Une erreur est survenue');
    this.showToast(msg, 'error');
  }

  showToast(message: string, type: string) { this.toast = { message, type }; setTimeout(() => this.toast = null, 3000); }
}
