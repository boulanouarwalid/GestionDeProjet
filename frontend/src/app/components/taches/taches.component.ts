import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TacheService } from '../../services/tache.service';
import { ProjetService } from '../../services/projet.service';
import { Tache, TacheDTO, Projet } from '../../models/models';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-taches',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="taches-page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Tâches</h1>
          <p class="page-subtitle">Gérez toutes les tâches de vos projets</p>
        </div>
        <button class="btn btn-primary" (click)="showModal = true">+ Nouvelle Tâche</button>
      </div>

      <!-- Filters -->
      <div class="filters-bar glass-panel animate-in">
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
            <option value="TERMINEE">Terminée</option>
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
          </select>
        </div>
      </div>

      <!-- Table -->
      <div class="glass-panel table-container animate-in" style="animation-delay: 0.1s">
        @if (filteredTaches.length > 0) {
          <table class="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Libellé</th>
                <th>Projet</th>
                <th>Type</th>
                <th>Statut</th>
                <th>Échéance</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (t of filteredTaches; track t.id) {
                <tr>
                  <td>#{{ t.id }}</td>
                  <td style="font-weight: 500; color: var(--text-primary)">{{ t.libelle }}</td>
                  <td>
                    @if (t.projet) {
                      <a [routerLink]="['/projets', t.projet.id]" class="project-link-inline">{{ t.projet.nomProjet }}</a>
                    } @else { — }
                  </td>
                  <td><span class="badge badge-violet">{{ formatType(t.type) }}</span></td>
                  <td><span class="badge" [class]="getStatusBadge(t.status)">{{ t.status }}</span></td>
                  <td>{{ t.date_echeance || '—' }}</td>
                  <td>
                    <div class="action-btns">
                      <button class="btn btn-icon btn-ghost" (click)="editTache(t)">✏️</button>
                      <button class="btn btn-icon btn-ghost" (click)="confirmDelete(t)">🗑️</button>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        } @else {
          <div class="empty-state">
            <div class="empty-state-icon">✅</div>
            <div class="empty-state-text">Aucune tâche trouvée</div>
          </div>
        }
      </div>

      <!-- Create/Edit Modal -->
      @if (showModal) {
        <div class="modal-overlay" (click)="closeModal()">
          <div class="modal-panel" (click)="$event.stopPropagation()">
            <h2>{{ editing ? 'Modifier Tâche' : 'Nouvelle Tâche' }}</h2>
            @if (!editing) {
              <div class="form-group" style="margin-bottom: 16px">
                <label>Projet</label>
                <select class="form-control" [(ngModel)]="selectedProjetId">
                  <option [ngValue]="0">-- Choisir un projet --</option>
                  @for (p of projets; track p.id) {
                    <option [ngValue]="p.id">{{ p.nomProjet }}</option>
                  }
                </select>
              </div>
            }
            <div class="form-group" style="margin-bottom: 16px">
              <label>Libellé</label>
              <input type="text" class="form-control" [(ngModel)]="form.libelle" placeholder="Nom de la tâche">
            </div>
            <div class="form-row" style="margin-bottom: 16px">
              <div class="form-group">
                <label>Type</label>
                <select class="form-control" [(ngModel)]="form.type">
                  <option value="">-- Choisir --</option>
                  <option value="SOFTWARE_ENGINEERING">Software Engineering</option>
                  <option value="CYBERSECURITY">Cybersecurity</option>
                  <option value="DATA_SCIENCE">Data Science & Analytics</option>
                  <option value="DEVOPS">DevOps & Infrastructure</option>
                </select>
              </div>
              <div class="form-group">
                <label>Statut</label>
                <select class="form-control" [(ngModel)]="form.statut">
                  <option value="">-- Choisir --</option>
                  <option value="EN_ATTENTE">En Attente</option>
                  <option value="EN_COURS">En Cours</option>
                  <option value="TERMINEE">Terminée</option>
                </select>
              </div>
            </div>
            <div class="form-group">
              <label>Date d'Échéance</label>
              <input type="date" class="form-control" [(ngModel)]="form.dateEcheance">
            </div>
            <div class="modal-actions">
              <button class="btn btn-ghost" (click)="closeModal()">Annuler</button>
              <button class="btn btn-primary" (click)="save()">{{ editing ? 'Modifier' : 'Créer' }}</button>
            </div>
          </div>
        </div>
      }

      <!-- Delete Confirm -->
      @if (tacheToDelete) {
        <div class="modal-overlay" (click)="tacheToDelete = null">
          <div class="modal-panel confirm-panel" (click)="$event.stopPropagation()">
            <div class="confirm-icon">⚠️</div>
            <h2>Supprimer la Tâche</h2>
            <p>"{{ tacheToDelete.libelle }}" sera supprimée définitivement.</p>
            <div class="modal-actions" style="justify-content: center">
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
    .filters-bar {
      display: flex;
      gap: 16px;
      padding: 16px 20px;
      margin-bottom: 20px;
      flex-wrap: wrap;
    }
    .filter-group { display: flex; flex-direction: column; gap: 4px; min-width: 180px; }
    .filter-group label { font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; }
    .filter-group .form-control { padding: 8px 12px; font-size: 0.85rem; }
    .table-container { padding: 0; overflow: hidden; }
    .action-btns { display: flex; gap: 4px; }
    .project-link-inline { color: var(--accent-blue); font-size: 0.85rem; }
    .project-link-inline:hover { text-decoration: underline; }
  `]
})
export class TachesComponent implements OnInit {
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

  constructor(
    private tacheService: TacheService,
    private projetService: ProjetService
  ) {}

  ngOnInit() {
    this.projetService.getAll().subscribe(p => this.projets = p);
    this.loadTaches();
  }

  loadTaches() {
    if (this.filterProjetId > 0) {
      this.tacheService.getByProjet(this.filterProjetId).subscribe(t => { this.taches = t; this.applyFilters(); });
    } else {
      this.tacheService.getAll().subscribe(t => { this.taches = t; this.applyFilters(); });
    }
  }

  applyFilters() {
    this.filteredTaches = this.taches.filter(t => {
      if (this.filterStatus && t.status !== this.filterStatus) return false;
      if (this.filterType && t.type !== this.filterType) return false;
      return true;
    });
  }

  editTache(t: Tache) {
    this.editing = t;
    this.form = { libelle: t.libelle, dateEcheance: t.date_echeance, statut: t.status, type: t.type };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.editing = null;
    this.form = { libelle: '', dateEcheance: '', statut: '', type: '' };
    this.selectedProjetId = 0;
  }

  save() {
    if (this.editing) {
      this.tacheService.update(this.editing.id, this.form).subscribe({
        next: () => { this.closeModal(); this.loadTaches(); this.showToast('Tâche modifiée', 'success'); },
        error: () => this.showToast('Erreur de modification', 'error')
      });
    } else {
      if (!this.selectedProjetId) { this.showToast('Veuillez choisir un projet', 'error'); return; }
      this.tacheService.create(this.selectedProjetId, this.form).subscribe({
        next: () => { this.closeModal(); this.loadTaches(); this.showToast('Tâche créée', 'success'); },
        error: () => this.showToast('Erreur de création', 'error')
      });
    }
  }

  confirmDelete(t: Tache) { this.tacheToDelete = t; }

  deleteTache() {
    if (!this.tacheToDelete) return;
    this.tacheService.delete(this.tacheToDelete.id).subscribe({
      next: () => { this.tacheToDelete = null; this.loadTaches(); this.showToast('Tâche supprimée', 'success'); },
      error: () => this.showToast('Erreur de suppression', 'error')
    });
  }

  getStatusBadge(status: string): string {
    const map: Record<string, string> = { 'EN_COURS': 'badge-blue', 'TERMINEE': 'badge-emerald', 'EN_ATTENTE': 'badge-amber' };
    return 'badge ' + (map[status] || 'badge-blue');
  }

  formatType(type: string): string {
    const map: Record<string, string> = {
      'SOFTWARE_ENGINEERING': 'Software Eng.', 'CYBERSECURITY': 'Cybersecurity',
      'DATA_SCIENCE': 'Data Science', 'DEVOPS': 'DevOps',
      'GENIE_CIVIL': 'Génie Civil', 'ELECTRICITE': 'Électricité'
    };
    return map[type] || type;
  }

  showToast(message: string, type: string) {
    this.toast = { message, type };
    setTimeout(() => this.toast = null, 3000);
  }
}
