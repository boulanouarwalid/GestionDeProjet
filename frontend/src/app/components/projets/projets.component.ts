import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProjetService } from '../../services/projet.service';
import { DataCacheService } from '../../services/data-cache.service';
import { Projet, ProjetDTO, BudgetDTO, InitProjetRequest } from '../../models/models';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-projets',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
<div class="page">

  <!-- Header -->
  <header class="page-header animate-in">
    <div>
      <div class="page-eyebrow"><span class="eyebrow-line"></span>Gestion</div>
      <h1 class="page-title">Projets</h1>
      <p class="page-subtitle">Gerez vos projets et leurs ressources</p>
    </div>
    <button class="btn btn-primary" (click)="showCreateModal = true">
      <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
        <path d="M6.5 1.5V11.5M1.5 6.5H11.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
      Nouveau Projet
    </button>
  </header>

  <!-- Search -->
  <div class="search-wrap glass-panel animate-in" style="animation-delay:0.05s">
    <svg class="search-ico" width="15" height="15" viewBox="0 0 15 15" fill="none">
      <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" stroke-width="1.5"/>
      <path d="M10.5 10.5L13.5 13.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    </svg>
    <input class="search-input" type="text" placeholder="Rechercher un projet..."
           [(ngModel)]="searchTerm" (input)="filterProjets()">
    @if (searchTerm) {
      <button class="search-clear" (click)="searchTerm=''; filterProjets()">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 2L10 10M10 2L2 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </button>
    }
  </div>

  <!-- Grid -->
  <div class="projects-grid">
    @for (p of filteredProjets; track p.id; let i = $index) {
      <div class="project-card glass-panel animate-in" [style.animation-delay]="(i * 0.04) + 's'">
        <!-- Top accent line -->
        <div class="card-accent" [style.background]="cardColors[i % cardColors.length]"></div>

        <div class="card-header">
          <div class="card-avatar" [style.background]="cardColors[i % cardColors.length]">
            {{ p.nomProjet.charAt(0).toUpperCase() }}
          </div>
          <div class="card-actions">
            <button class="btn btn-icon btn-ghost" title="Cloner" (click)="cloneProjet(p.id)">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <rect x="4" y="4" width="8" height="8" rx="1.5" stroke="currentColor" stroke-width="1.3"/>
                <path d="M2 10V3C2 2.4 2.4 2 3 2H10" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
              </svg>
            </button>
            <div class="dropdown-wrap">
              <button class="btn btn-icon btn-ghost" title="Rapport" (click)="toggleReportMenu(p.id); $event.stopPropagation()">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M3 2H9L12 5V12C12 12.6 11.6 13 11 13H3C2.4 13 2 12.6 2 12V3C2 2.4 2.4 2 3 2Z" stroke="currentColor" stroke-width="1.3"/>
                  <path d="M9 2V5H12" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
                  <path d="M5 8H9M5 10H7" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
                </svg>
              </button>
              @if (reportMenuProjetId === p.id) {
                <div class="dropdown-menu">
                  <button class="dropdown-item" (click)="genererRapport(p.id, 'rapportPDFService'); $event.stopPropagation()">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 1H8L10 3V11C10 11.6 9.6 12 9 12H2C1.4 12 1 11.6 1 11V2C1 1.4 1.4 1 2 1Z" stroke="currentColor" stroke-width="1.2"/><path d="M8 1V3H10" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>
                    Rapport PDF
                  </button>
                  <button class="dropdown-item" (click)="genererRapport(p.id, 'rapportExcelService'); $event.stopPropagation()">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><rect x="1" y="1" width="10" height="10" rx="2" stroke="currentColor" stroke-width="1.2" fill="none"/><path d="M3 4L6 6L3 8" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    Rapport Excel
                  </button>
                </div>
              }
            </div>
            <button class="btn btn-icon btn-ghost danger-hover" title="Supprimer" (click)="confirmDelete(p)">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 4H12M5 4V3H9V4M5.5 6.5V10.5M8.5 6.5V10.5M3 4L3.5 11C3.5 11.6 3.9 12 4.5 12H9.5C10.1 12 10.5 11.6 10.5 11L11 4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        <h3 class="card-name">{{ p.nomProjet }}</h3>
        <div class="card-id">Projet #{{ p.id }}</div>

        <div class="card-meta">
          <div class="meta-pill">
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <rect x="1" y="1" width="9" height="9" rx="2" stroke="currentColor" stroke-width="1.2" fill="none"/>
              <path d="M3.5 5.5L5 7L7.5 4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            {{ p.taches?.length || 0 }} taches
          </div>
          <div class="meta-pill">
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <rect x="1" y="3" width="9" height="7" rx="1.5" fill="currentColor" opacity="0.7"/>
              <path d="M1 5H10" stroke="rgba(255,255,255,0.4)" stroke-width="0.8"/>
            </svg>
            {{ p.budgets?.length || 0 }} budgets
          </div>
        </div>

        <a [routerLink]="['/projets', p.id]" class="card-link">
          Voir Details
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 6H10M7 3L10 6L7 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </a>
      </div>
    }
  </div>

  <!-- Empty state -->
  @if (filteredProjets.length === 0) {
    <div class="glass-panel empty-state animate-in">
      <svg width="52" height="52" viewBox="0 0 52 52" fill="none" style="opacity:0.15;margin-bottom:14px">
        <path d="M6 18C6 15.8 7.8 14 10 14H22L26 18H42C44.2 18 46 19.8 46 22V40C46 42.2 44.2 44 42 44H10C7.8 44 6 42.2 6 40V18Z" stroke="white" stroke-width="2"/>
      </svg>
      <div class="empty-state-text">{{ searchTerm ? 'Aucun projet trouve' : 'Aucun projet. Creez le premier.' }}</div>
      @if (!searchTerm) {
        <button class="btn btn-primary" (click)="showCreateModal = true">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 2V10M2 6H10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
          </svg>
          Nouveau Projet
        </button>
      }
    </div>
  }

  <!-- Create modal -->
  @if (showCreateModal) {
    <div class="modal-overlay" (click)="showCreateModal = false">
      <div class="modal-panel" (click)="$event.stopPropagation()">
        <div class="modal-icon azure">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M3 7C3 5.9 3.9 5 5 5H9L11 7H17C18.1 7 19 7.9 19 9V16C19 17.1 18.1 18 17 18H5C3.9 18 3 17.1 3 16V7Z" fill="currentColor" opacity="0.8"/>
          </svg>
        </div>
        <h2>Nouveau Projet</h2>
        <div class="form-group">
          <label>Nom du Projet</label>
          <input type="text" class="form-control" placeholder="Ex: Refonte Infrastructure..."
                 [(ngModel)]="formProjet.nomProjet" (keyup.enter)="createProjet()">
        </div>
        <div class="form-divider">
          <span class="divider-text">Budget (optionnel)</span>
        </div>
        <div class="form-row">
          <div class="form-group" style="flex:1">
            <label>Montant (MAD)</label>
            <input type="number" class="form-control" placeholder="Ex: 500000"
                   [(ngModel)]="formBudget.montantPrevu">
          </div>
          <div class="form-group" style="flex:1">
            <label>Categorie</label>
            <input type="text" class="form-control" placeholder="Ex: Infrastructure"
                   [(ngModel)]="formBudget.categorie">
          </div>
        </div>
        <div class="modal-actions">
          <button class="btn btn-ghost" (click)="showCreateModal = false">Annuler</button>
          <button class="btn btn-primary" (click)="createProjet()" [disabled]="!formProjet.nomProjet.trim()">Creer</button>
        </div>
      </div>
    </div>
  }

  <!-- Delete confirm -->
  @if (projetToDelete) {
    <div class="modal-overlay" (click)="projetToDelete = null">
      <div class="modal-panel confirm-panel" (click)="$event.stopPropagation()">
        <div class="modal-icon rose">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 3L18 17H2L10 3Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" fill="none"/>
            <path d="M10 9V12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
            <circle cx="10" cy="14.5" r="0.8" fill="currentColor"/>
          </svg>
        </div>
        <h2>Confirmer la Suppression</h2>
        <p>Le projet <strong>"{{ projetToDelete.nomProjet }}"</strong> sera supprime definitivement.</p>
        <div class="modal-actions" style="justify-content:center">
          <button class="btn btn-ghost" (click)="projetToDelete = null">Annuler</button>
          <button class="btn btn-danger" (click)="deleteProjet()">Supprimer</button>
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
    .page { animation: fadeIn 0.3s ease; }

    .page-eyebrow { display:flex; align-items:center; gap:8px; font-size:0.68rem; font-weight:700; color:var(--ink-4); text-transform:uppercase; letter-spacing:0.1em; margin-bottom:5px; }
    .eyebrow-line { display:block; width:20px; height:2px; background:var(--g-aurora); border-radius:2px; }

    /* Search */
    .search-wrap { display:flex; align-items:center; gap:10px; padding:11px 16px; margin-bottom:24px; }
    .search-ico { color:var(--ink-4); flex-shrink:0; }
    .search-input { flex:1; background:none; border:none; color:var(--ink-1); font-size:0.88rem; font-family:inherit; }
    .search-input::placeholder { color:var(--ink-4); }
    .search-clear { color:var(--ink-4); display:flex; align-items:center; transition:color var(--dur-fast); }
    .search-clear:hover { color:var(--ink-2); }

    /* Grid */
    .projects-grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(300px,1fr)); gap:18px; margin-bottom:20px; }

    /* Card */
    .project-card { padding:22px; display:flex; flex-direction:column; position:relative; transition:all var(--dur-slow) var(--ease-out-expo); overflow:hidden; }
    .project-card:hover { transform:translateY(-4px); border-color:var(--glass-4); box-shadow:var(--shadow-lg); }

    .card-accent { position:absolute; top:0; left:0; right:0; height:2px; }

    .card-header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:16px; }

    .card-avatar { width:42px; height:42px; border-radius:var(--r-md); display:flex; align-items:center; justify-content:center; font-family:'Space Grotesk',sans-serif; font-size:1.1rem; font-weight:800; color:white; flex-shrink:0; }

    .card-actions { display:flex; gap:3px; }

    .danger-hover:hover { color:var(--a-rose); border-color:rgba(244,63,94,0.3); }

    .card-name { font-family:'Space Grotesk',sans-serif; font-size:1.05rem; font-weight:700; color:var(--ink-0); margin-bottom:3px; letter-spacing:-0.01em; }
    .card-id { font-size:0.7rem; color:var(--ink-4); font-weight:500; margin-bottom:14px; }

    .card-meta { display:flex; gap:8px; margin-bottom:18px; flex-wrap:wrap; }
    .meta-pill { display:inline-flex; align-items:center; gap:5px; padding:4px 10px; border-radius:var(--r-full); background:var(--glass-2); border:1px solid var(--glass-3); font-size:0.72rem; color:var(--ink-3); font-weight:500; }

    .card-link { margin-top:auto; display:inline-flex; align-items:center; gap:6px; font-size:0.8rem; font-weight:600; color:var(--a-azure); transition:gap var(--dur-base) var(--ease-out-expo); }
    .card-link:hover { gap:10px; }

    /* Modal icon */
    .modal-icon { width:44px; height:44px; border-radius:var(--r-md); display:flex; align-items:center; justify-content:center; margin-bottom:16px; }
    .modal-icon.azure { background:rgba(79,143,255,0.12); color:var(--a-azure); }
    .modal-icon.rose  { background:rgba(244,63,94,0.12);  color:var(--a-rose); }

    .confirm-panel p { color:var(--ink-3); font-size:0.88rem; margin-bottom:0; }
    .confirm-panel strong { color:var(--ink-1); }

    /* Dropdown */
    .dropdown-wrap { position:relative; }
    .dropdown-menu { position:absolute; top:100%; right:0; z-index:50; min-width:150px; margin-top:4px; padding:6px; background:var(--surface-2); border:1px solid var(--glass-3); border-radius:var(--r-md); box-shadow:var(--shadow-lg); display:flex; flex-direction:column; gap:3px; }
    .dropdown-item { display:flex; align-items:center; gap:8px; padding:8px 12px; border:none; background:none; color:var(--ink-2); font-size:0.78rem; font-weight:500; font-family:inherit; cursor:pointer; border-radius:var(--r-sm); transition:background var(--dur-fast); width:100%; text-align:left; }
    .dropdown-item:hover { background:var(--glass-2); color:var(--ink-0); }

    /* Form divider */
    .form-divider { display:flex; align-items:center; gap:12px; margin:16px 0; }
    .form-divider::before, .form-divider::after { content:''; flex:1; height:1px; background:var(--glass-3); }
    .divider-text { font-size:0.68rem; font-weight:700; color:var(--ink-4); text-transform:uppercase; letter-spacing:0.08em; white-space:nowrap; }
    .form-row { display:flex; gap:14px; }

    /* Card color palette */
    :host { --c0: linear-gradient(135deg,#4f8fff,#2563eb); }
  `]
})
export class ProjetsComponent implements OnInit, OnDestroy {
  projets: Projet[] = [];
  filteredProjets: Projet[] = [];
  searchTerm = '';
  showCreateModal = false;
  formProjet: ProjetDTO = { nomProjet: '' };
  formBudget: BudgetDTO = { montantPrevu: 0, categorie: '' };
  projetToDelete: Projet | null = null;
  toast: { message: string; type: string } | null = null;
  reportMenuProjetId: number | null = null;
  private sub!: Subscription;

  cardColors = [
    'linear-gradient(135deg,#4f8fff,#2563eb)',
    'linear-gradient(135deg,#8b5cf6,#6d28d9)',
    'linear-gradient(135deg,#10b981,#059669)',
    'linear-gradient(135deg,#f59e0b,#d97706)',
    'linear-gradient(135deg,#f43f5e,#e11d48)',
    'linear-gradient(135deg,#d946ef,#a21caf)',
  ];

  constructor(private projetService: ProjetService, private cache: DataCacheService) {}

  @HostListener('document:click')
  closeReportMenu() { this.reportMenuProjetId = null; }

  ngOnInit() {
    // Subscribe to cache — instant if already loaded
    this.sub = this.cache.projets$.subscribe(data => {
      this.projets = data;
      this.filterProjets();
    });
    this.cache.init();
  }

  ngOnDestroy() { if (this.sub) this.sub.unsubscribe(); }

  loadProjets() { this.cache.refreshProjets(); }

  filterProjets() {
    const t = this.searchTerm.toLowerCase();
    this.filteredProjets = this.projets.filter(p => p.nomProjet.toLowerCase().includes(t));
  }

  createProjet() {
    if (!this.formProjet.nomProjet?.trim()) return;
    const hasBudget = this.formBudget.montantPrevu > 0 && this.formBudget.categorie?.trim();

    if (hasBudget) {
      const req: InitProjetRequest = {
        projetDTO: { nomProjet: this.formProjet.nomProjet.trim() },
        budgetDTO: { montantPrevu: this.formBudget.montantPrevu, categorie: this.formBudget.categorie.trim() }
      };
      this.projetService.initialiser(req).subscribe({
        next: (created: Projet) => {
          this.resetForm();
          this.cache.addProjet(created);
          this.cache.refreshProjets();
          this.cache.signalBudgetRefresh();
          this.showToast('Projet + Budget crees', 'success');
        },
        error: () => this.showToast('Erreur de creation', 'error')
      });
    } else {
      this.projetService.create({ nomProjet: this.formProjet.nomProjet.trim() }).subscribe({
        next: (created: Projet) => {
          this.resetForm();
          this.cache.addProjet(created);
          this.showToast('Projet cree', 'success');
        },
        error: () => this.showToast('Erreur de creation', 'error')
      });
    }
  }

  private resetForm() {
    this.showCreateModal = false;
    this.formProjet = { nomProjet: '' };
    this.formBudget = { montantPrevu: 0, categorie: '' };
  }

  cloneProjet(id: number) {
    this.projetService.cloner(id).subscribe({
      next: () => { this.cache.refreshProjets(); this.showToast('Projet clone', 'success'); },
      error: () => this.showToast('Erreur de clonage', 'error')
    });
  }

  toggleReportMenu(id: number) {
    this.reportMenuProjetId = this.reportMenuProjetId === id ? null : id;
  }

  genererRapport(id: number, format: string) {
    this.reportMenuProjetId = null;
    this.projetService.genererRapport(id, format).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'rapport_' + id + '_' + format + '.' + (format.includes('PDF') ? 'txt' : 'csv');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        this.showToast('Rapport telecharge', 'success');
      },
      error: () => this.showToast('Erreur de rapport', 'error')
    });
  }

  confirmDelete(p: Projet) { this.projetToDelete = p; }

  deleteProjet() {
    if (!this.projetToDelete) return;
    this.projetService.delete(this.projetToDelete.id).subscribe({
      next: () => { this.projetToDelete = null; this.cache.refreshProjets(); this.showToast('Projet supprime', 'success'); },
      error: () => this.showToast('Erreur de suppression', 'error')
    });
  }

  showToast(message: string, type: string) {
    this.toast = { message, type }; setTimeout(() => this.toast = null, 3000);
  }
}
