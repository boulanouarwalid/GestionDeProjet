import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TacheService } from '../../services/tache.service';
import { ProjetService } from '../../services/projet.service';
import { DataCacheService } from '../../services/data-cache.service';
import { Tache, TacheDTO, Projet } from '../../models/models';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-taches',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
<div class="page">

  <!-- Header -->
  <header class="page-header animate-in">
    <div>
      <div class="page-eyebrow"><span class="eyebrow-line"></span>Execution</div>
      <h1 class="page-title">Taches</h1>
      <p class="page-subtitle">Gerez toutes les taches de vos projets</p>
    </div>
    <button class="btn btn-primary" (click)="showModal = true">
      <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
        <path d="M6.5 1.5V11.5M1.5 6.5H11.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
      Nouvelle Tache
    </button>
  </header>

  <!-- Filters -->
  <div class="filters-bar glass-panel animate-in" style="animation-delay:0.05s">
    <div class="filter-group">
      <label>Projet</label>
      <select class="form-control" [(ngModel)]="filterProjetId" (change)="loadTaches()">
        <option [ngValue]="0">Tous les projets</option>
        @for (p of projets; track p.id) {
          <option [ngValue]="p.id">{{ p.nomProjet }}</option>
        }
      </select>
    </div>
    <div class="filter-group">
      <label>Statut</label>
      <select class="form-control" [(ngModel)]="filterStatus" (change)="applyFilters()">
        <option value="">Tous</option>
        <option value="EN_ATTENTE">En Attente</option>
        <option value="EN_COURS">En Cours</option>
        <option value="TERMINEE">Terminee</option>
      </select>
    </div>
    <div class="filter-group">
      <label>Type</label>
      <select class="form-control" [(ngModel)]="filterType" (change)="applyFilters()">
        <option value="">Tous</option>
        <option value="SOFTWARE_ENGINEERING">Software Engineering</option>
        <option value="CYBERSECURITY">Cybersecurity</option>
        <option value="DATA_SCIENCE">Data Science</option>
        <option value="DEVOPS">DevOps</option>
        <option value="GENIE_CIVIL">Genie Civil</option>
        <option value="ELECTRICITE">Electricite</option>
      </select>
    </div>
    <div class="filter-count">
      <span class="count-num">{{ filteredTaches.length }}</span>
      <span class="count-label">tache{{ filteredTaches.length !== 1 ? 's' : '' }}</span>
    </div>
  </div>

  <!-- Table -->
  <div class="glass-panel table-wrap animate-in" style="animation-delay:0.1s">
    @if (filteredTaches.length > 0) {
      <table class="data-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Libelle</th>
            <th>Projet</th>
            <th>Type</th>
            <th>Statut</th>
            <th>Echeance</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          @for (t of filteredTaches; track t.id; let i = $index) {
            <tr class="table-row" [style.animation-delay]="(i * 0.03) + 's'">
              <td><span class="row-id">{{ t.id }}</span></td>
              <td>
                <div class="tache-name-cell">
                  <div class="tache-dot" [class]="getStatusDot(t.status)"></div>
                  {{ t.libelle }}
                </div>
              </td>
              <td>
                @if (t.projet) {
                  <a [routerLink]="['/projets', t.projet.id]" class="proj-link">{{ t.projet.nomProjet }}</a>
                } @else { <span style="color:var(--ink-5)">—</span> }
              </td>
              <td><span class="badge badge-violet">{{ formatType(t.type) }}</span></td>
              <td><span class="badge" [class]="getStatusBadge(t.status)">{{ t.status }}</span></td>
              <td><span class="date-cell">{{ t.dateEcheance || '—' }}</span></td>
              <td>
                <div class="row-actions">
                  <button class="btn btn-icon btn-ghost" (click)="editTache(t)" title="Modifier">
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                      <path d="M9 2L11 4L4 11H2V9L9 2Z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/>
                    </svg>
                  </button>
                  <button class="btn btn-icon btn-ghost danger-hover" (click)="confirmDelete(t)" title="Supprimer">
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
          <rect x="6" y="6" width="36" height="36" rx="8" stroke="white" stroke-width="2"/>
          <path d="M16 24L21 29L32 18" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <div class="empty-state-text">Aucune tache trouvee</div>
      </div>
    }
  </div>

  <!-- Create / Edit Modal -->
  @if (showModal) {
    <div class="modal-overlay" (click)="closeModal()">
      <div class="modal-panel" (click)="$event.stopPropagation()">
        <div class="modal-icon azure">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <rect x="2" y="2" width="14" height="14" rx="3" stroke="currentColor" stroke-width="1.5" fill="none"/>
            <path d="M6 9L8 11L12 7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <h2>{{ editing ? 'Modifier Tache' : 'Nouvelle Tache' }}</h2>
        @if (!editing) {
          <div class="form-group" style="margin-bottom:14px">
            <label>Projet</label>
            <select class="form-control" [(ngModel)]="selectedProjetId">
              <option [ngValue]="0">-- Choisir un projet --</option>
              @for (p of projets; track p.id) {
                <option [ngValue]="p.id">{{ p.nomProjet }}</option>
              }
            </select>
          </div>
        }
        <div class="form-group" style="margin-bottom:14px">
          <label>Libelle</label>
          <input type="text" class="form-control" [(ngModel)]="form.libelle" placeholder="Nom de la tache">
        </div>
        <div class="form-row" style="margin-bottom:14px">
          <div class="form-group">
            <label>Type</label>
            <select class="form-control" [(ngModel)]="form.type">
              <option value="">-- Choisir --</option>
              <option value="SOFTWARE_ENGINEERING">Software Engineering</option>
              <option value="CYBERSECURITY">Cybersecurity</option>
              <option value="DATA_SCIENCE">Data Science</option>
              <option value="DEVOPS">DevOps</option>
              <option value="GENIE_CIVIL">Genie Civil</option>
              <option value="ELECTRICITE">Electricite</option>
            </select>
          </div>
          <div class="form-group">
            <label>Statut</label>
            <select class="form-control" [(ngModel)]="form.statut">
              <option value="">-- Choisir --</option>
              <option value="EN_ATTENTE">En Attente</option>
              <option value="EN_COURS">En Cours</option>
              <option value="TERMINEE">Terminee</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label>Date d'Echeance</label>
          <input type="date" class="form-control" [(ngModel)]="form.dateEcheance">
        </div>
        <div class="modal-actions">
          <button class="btn btn-ghost" (click)="closeModal()">Annuler</button>
          <button class="btn btn-primary" (click)="save()">{{ editing ? 'Modifier' : 'Creer' }}</button>
        </div>
      </div>
    </div>
  }

  <!-- Delete confirm -->
  @if (tacheToDelete) {
    <div class="modal-overlay" (click)="tacheToDelete = null">
      <div class="modal-panel confirm-panel" (click)="$event.stopPropagation()">
        <div class="modal-icon rose">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M9 3L16 15H2L9 3Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" fill="none"/>
            <path d="M9 8V11" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
            <circle cx="9" cy="13" r="0.8" fill="currentColor"/>
          </svg>
        </div>
        <h2>Supprimer la Tache</h2>
        <p><strong>"{{ tacheToDelete.libelle }}"</strong> sera supprimee definitivement.</p>
        <div class="modal-actions" style="justify-content:center">
          <button class="btn btn-ghost" (click)="tacheToDelete = null">Annuler</button>
          <button class="btn btn-danger" (click)="deleteTache()">Supprimer</button>
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

    /* Filters */
    .filters-bar { display:flex; align-items:flex-end; gap:16px; padding:16px 20px; margin-bottom:20px; flex-wrap:wrap; }
    .filter-group { display:flex; flex-direction:column; gap:5px; min-width:170px; }
    .filter-group label { font-size:0.68rem; font-weight:700; color:var(--ink-4); text-transform:uppercase; letter-spacing:0.08em; }
    .filter-count { margin-left:auto; display:flex; flex-direction:column; align-items:flex-end; }
    .count-num { font-family:'Space Grotesk',sans-serif; font-size:1.6rem; font-weight:800; color:var(--ink-0); line-height:1; letter-spacing:-0.03em; }
    .count-label { font-size:0.68rem; color:var(--ink-4); font-weight:500; text-transform:uppercase; letter-spacing:0.06em; }

    /* Table */
    .table-wrap { overflow:hidden; }
    .table-row { animation:slideUp var(--dur-slow) var(--ease-out-expo) both; }
    .row-id { font-family:'Space Grotesk',sans-serif; font-size:0.72rem; color:var(--ink-4); font-weight:600; }
    .tache-name-cell { display:flex; align-items:center; gap:8px; font-weight:500; color:var(--ink-1); }
    .tache-dot { width:7px; height:7px; border-radius:50%; flex-shrink:0; }
    .tache-dot.azure { background:var(--a-azure); box-shadow:0 0 5px var(--a-azure); }
    .tache-dot.jade  { background:var(--a-jade);  box-shadow:0 0 5px var(--a-jade); }
    .tache-dot.amber { background:var(--a-amber); box-shadow:0 0 5px var(--a-amber); }
    .proj-link { color:var(--a-azure); font-size:0.82rem; font-weight:500; transition:opacity var(--dur-fast); }
    .proj-link:hover { opacity:0.7; }
    .date-cell { font-size:0.8rem; color:var(--ink-4); font-family:'Space Grotesk',sans-serif; }
    .row-actions { display:flex; gap:3px; }
    .danger-hover:hover { color:var(--a-rose); }

    /* Modal */
    .modal-icon { width:42px; height:42px; border-radius:var(--r-md); display:flex; align-items:center; justify-content:center; margin-bottom:14px; }
    .modal-icon.azure { background:rgba(79,143,255,0.12); color:var(--a-azure); }
    .modal-icon.rose  { background:rgba(244,63,94,0.12);  color:var(--a-rose); }
    .confirm-panel p { color:var(--ink-3); font-size:0.88rem; margin-bottom:0; }
    .confirm-panel strong { color:var(--ink-1); }
  `]
})
export class TachesComponent implements OnInit, OnDestroy {
  taches: Tache[] = [];
  filteredTaches: Tache[] = [];
  projets: Projet[] = [];
  filterProjetId = 0;
  filterStatus = '';
  filterType = '';
  showModal = false;
  editing: Tache | null = null;
  selectedProjetId = 0;
  form: TacheDTO = { libelle: '', dateEcheance: '', statut: '', type: '' };
  tacheToDelete: Tache | null = null;
  toast: { message: string; type: string } | null = null;
  private sub!: Subscription;

  constructor(private tacheService: TacheService, private projetService: ProjetService, private cache: DataCacheService) {}

  ngOnInit() {
    // Projets list from cache (for dropdowns)
    this.sub = this.cache.projets$.subscribe(p => this.projets = p);
    // Taches from cache — instant on revisit
    this.cache.taches$.subscribe(t => { this.taches = t; this.applyFilters(); });
    this.cache.init();
  }

  ngOnDestroy() { if (this.sub) this.sub.unsubscribe(); }

  loadTaches() {
    if (this.filterProjetId > 0) {
      // Project-scoped filter: fetch directly (not in global cache)
      this.tacheService.getByProjet(this.filterProjetId).subscribe(t => { this.taches = t; this.applyFilters(); });
    } else {
      // Show all from cache
      this.taches = this.cache.tachesSnapshot;
      this.applyFilters();
    }
  }

  applyFilters() {
    this.filteredTaches = this.taches.filter(t => {
      if (this.filterStatus && t.status !== this.filterStatus) return false;
      if (this.filterType && t.type !== this.filterType) return false;
      return true;
    });
  }

  editTache(t: Tache) { this.editing = t; this.form = { libelle: t.libelle, dateEcheance: t.dateEcheance, statut: t.status, type: t.type }; this.showModal = true; }
  closeModal() { this.showModal = false; this.editing = null; this.form = { libelle: '', dateEcheance: '', statut: '', type: '' }; this.selectedProjetId = 0; }

  save() {
    if (this.editing) {
      this.tacheService.update(this.editing.id, this.form).subscribe({ next: () => { this.closeModal(); this.cache.refreshTaches(); this.showToast('Tache modifiee', 'success'); }, error: () => this.showToast('Erreur', 'error') });
    } else {
      if (!this.selectedProjetId) { this.showToast('Choisissez un projet', 'error'); return; }
      this.tacheService.create(this.selectedProjetId, this.form).subscribe({ next: () => { this.closeModal(); this.cache.refreshTaches(); this.showToast('Tache creee', 'success'); }, error: () => this.showToast('Erreur', 'error') });
    }
  }

  confirmDelete(t: Tache) { this.tacheToDelete = t; }
  deleteTache() {
    if (!this.tacheToDelete) return;
    this.tacheService.delete(this.tacheToDelete.id).subscribe({ next: () => { this.tacheToDelete = null; this.cache.refreshTaches(); this.showToast('Tache supprimee', 'success'); }, error: () => this.showToast('Erreur', 'error') });
  }

  getStatusBadge(s: string) { const m: Record<string,string> = { EN_COURS:'badge-blue', TERMINEE:'badge-emerald', EN_ATTENTE:'badge-amber' }; return 'badge ' + (m[s] || 'badge-blue'); }
  getStatusDot(s: string)   { const m: Record<string,string> = { EN_COURS:'azure', TERMINEE:'jade', EN_ATTENTE:'amber' }; return m[s] || 'azure'; }
  formatType(t: string) { const m: Record<string,string> = { SOFTWARE_ENGINEERING:'Software', CYBERSECURITY:'Cyber', DATA_SCIENCE:'Data Sci', DEVOPS:'DevOps', GENIE_CIVIL:'Genie Civil', ELECTRICITE:'Electr.' }; return m[t] || t; }
  showToast(message: string, type: string) { this.toast = { message, type }; setTimeout(() => this.toast = null, 3000); }
}
