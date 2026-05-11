import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProjetService } from '../../services/projet.service';
import { Projet, ProjetDTO } from '../../models/models';

@Component({
  selector: 'app-projets',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="projets-page">
      <div class="page-header">
        <div>
          <h1 class="page-title">Projets</h1>
          <p class="page-subtitle">Gerez vos projets et leurs ressources</p>
        </div>
        <button class="btn btn-primary" (click)="showCreateModal = true"><i class="bi bi-plus-lg"></i> Nouveau Projet</button>
      </div>

      <div class="search-bar glass-panel animate-in">
        <i class="bi bi-search search-icon"></i>
        <input type="text" class="search-input" placeholder="Rechercher un projet..."
               [(ngModel)]="searchTerm" (input)="filterProjets()">
      </div>

      <div class="projects-grid">
        @for (p of filteredProjets; track p.id; let i = $index) {
          <div class="project-card glass-panel animate-in" [style.animation-delay]="(i * 0.05) + 's'">
            <div class="project-card-header">
              <div class="project-icon"><i class="bi bi-folder-fill"></i></div>
              <div class="project-actions">
                <button class="btn btn-icon btn-ghost" title="Cloner" (click)="cloneProjet(p.id)"><i class="bi bi-copy"></i></button>
                <button class="btn btn-icon btn-ghost" title="Rapport" (click)="genererRapport(p.id)"><i class="bi bi-file-earmark-text"></i></button>
                <button class="btn btn-icon btn-ghost" title="Supprimer" (click)="confirmDelete(p)"><i class="bi bi-trash"></i></button>
              </div>
            </div>
            <h3 class="project-name">{{ p.nomProjet }}</h3>
            <div class="project-meta">
              <div class="meta-item">
                <i class="bi bi-check2-square meta-icon"></i>
                <span>{{ p.taches?.length || 0 }} taches</span>
              </div>
              <div class="meta-item">
                <i class="bi bi-wallet2 meta-icon"></i>
                <span>{{ p.budgets?.length || 0 }} budgets</span>
              </div>
            </div>
            <a [routerLink]="['/projets', p.id]" class="project-link">Voir Details <i class="bi bi-arrow-right"></i></a>
          </div>
        }
      </div>

      @if (filteredProjets.length === 0) {
        <div class="glass-panel empty-state animate-in">
          <div class="empty-state-icon"><i class="bi bi-folder" style="font-size:3rem;opacity:0.3"></i></div>
          <div class="empty-state-text">{{ searchTerm ? 'Aucun projet trouve' : 'Aucun projet. Creez votre premier projet!' }}</div>
          @if (!searchTerm) {
            <button class="btn btn-primary" (click)="showCreateModal = true"><i class="bi bi-plus-lg"></i> Nouveau Projet</button>
          }
        </div>
      }

      @if (showCreateModal) {
        <div class="modal-overlay" (click)="showCreateModal = false">
          <div class="modal-panel" (click)="$event.stopPropagation()">
            <h2>Nouveau Projet</h2>
            <div class="form-group">
              <label>Nom du Projet</label>
              <input type="text" class="form-control" placeholder="Entrez le nom du projet..." [(ngModel)]="newProjetName">
            </div>
            <div class="modal-actions">
              <button class="btn btn-ghost" (click)="showCreateModal = false">Annuler</button>
              <button class="btn btn-primary" (click)="createProjet()" [disabled]="!newProjetName.trim()">Creer</button>
            </div>
          </div>
        </div>
      }

      @if (projetToDelete) {
        <div class="modal-overlay" (click)="projetToDelete = null">
          <div class="modal-panel confirm-panel" (click)="$event.stopPropagation()">
            <div class="confirm-icon"><i class="bi bi-exclamation-triangle" style="font-size:3rem;color:var(--accent-amber)"></i></div>
            <h2>Confirmer la Suppression</h2>
            <p>Voulez-vous vraiment supprimer le projet "{{ projetToDelete.nomProjet }}" ?</p>
            <div class="modal-actions" style="justify-content: center">
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
    .search-bar { display: flex; align-items: center; gap: 12px; padding: 12px 18px; margin-bottom: 24px; }
    .search-icon { font-size: 1rem; opacity: 0.5; }
    .search-input { flex: 1; background: none; border: none; color: var(--text-primary); font-size: 0.9rem; }
    .search-input::placeholder { color: var(--text-muted); }
    .projects-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px; margin-bottom: 20px; }
    .project-card { padding: 24px; transition: all var(--transition-base); display: flex; flex-direction: column; }
    .project-card:hover { transform: translateY(-3px); border-color: rgba(59,130,246,0.2); box-shadow: 0 8px 30px rgba(59,130,246,0.08); }
    .project-card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; }
    .project-icon { width: 44px; height: 44px; border-radius: var(--radius-md); background: rgba(59,130,246,0.1); display: flex; align-items: center; justify-content: center; font-size: 1.3rem; color: #60a5fa; }
    .project-actions { display: flex; gap: 4px; }
    .project-name { font-size: 1.1rem; font-weight: 600; margin-bottom: 12px; }
    .project-meta { display: flex; gap: 16px; margin-bottom: 16px; }
    .meta-item { display: flex; align-items: center; gap: 6px; font-size: 0.8rem; color: var(--text-muted); }
    .meta-icon { font-size: 0.9rem; }
    .project-link { margin-top: auto; font-size: 0.85rem; font-weight: 500; color: var(--accent-blue); transition: color var(--transition-fast); }
    .project-link:hover { color: #60a5fa; }
  `]
})
export class ProjetsComponent implements OnInit {
  projets: Projet[] = [];
  filteredProjets: Projet[] = [];
  searchTerm = '';
  showCreateModal = false;
  newProjetName = '';
  projetToDelete: Projet | null = null;
  toast: { message: string; type: string } | null = null;

  constructor(private projetService: ProjetService) {}
  ngOnInit() { this.loadProjets(); }

  loadProjets() {
    this.projetService.getAll().subscribe({
      next: (data) => { this.projets = data; this.filterProjets(); },
      error: () => this.showToast('Erreur de chargement des projets', 'error')
    });
  }

  filterProjets() {
    const term = this.searchTerm.toLowerCase();
    this.filteredProjets = this.projets.filter(p => p.nomProjet.toLowerCase().includes(term));
  }

  createProjet() {
    if (!this.newProjetName?.trim()) return;
    this.projetService.create({ nomProjet: this.newProjetName.trim() }).subscribe({
      next: () => { this.showCreateModal = false; this.newProjetName = ''; this.loadProjets(); this.showToast('Projet cree avec succes!', 'success'); },
      error: () => this.showToast('Erreur lors de la creation', 'error')
    });
  }

  cloneProjet(id: number) {
    this.projetService.cloner(id).subscribe({
      next: () => { this.loadProjets(); this.showToast('Projet clone avec succes!', 'success'); },
      error: () => this.showToast('Erreur lors du clonage', 'error')
    });
  }

  genererRapport(id: number) {
    this.projetService.genererRapport(id).subscribe({
      next: (msg) => this.showToast(msg || 'Rapport genere!', 'success'),
      error: () => this.showToast('Erreur lors de la generation du rapport', 'error')
    });
  }

  confirmDelete(p: Projet) { this.projetToDelete = p; }

  deleteProjet() {
    if (!this.projetToDelete) return;
    this.projetService.delete(this.projetToDelete.id).subscribe({
      next: () => { this.projetToDelete = null; this.loadProjets(); this.showToast('Projet supprime', 'success'); },
      error: () => this.showToast('Erreur lors de la suppression', 'error')
    });
  }

  showToast(message: string, type: string) {
    this.toast = { message, type }; setTimeout(() => this.toast = null, 3000);
  }
}
