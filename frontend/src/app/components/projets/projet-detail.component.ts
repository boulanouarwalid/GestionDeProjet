import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProjetService } from '../../services/projet.service';
import { BudgetService } from '../../services/budget.service';
import { TacheService } from '../../services/tache.service';
import { Projet, Budget, Tache, BudgetDTO, TacheDTO } from '../../models/models';

@Component({
  selector: 'app-projet-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="detail-page" *ngIf="projet">
      <div class="page-header">
        <div>
          <a routerLink="/projets" class="back-link">← Retour aux projets</a>
          <h1 class="page-title">{{ projet.nomProjet }}</h1>
          <p class="page-subtitle">Projet #{{ projet.id }}</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-ghost" (click)="cloneProjet()">📋 Cloner</button>
          <button class="btn btn-ghost" (click)="genererRapport()">📄 Rapport</button>
        </div>
      </div>

      <!-- Avancement -->
      <div class="glass-panel avancement-card animate-in">
        <div class="avancement-header">
          <h3 class="section-title">📈 Avancement Budgétaire</h3>
          <span class="avancement-value">{{ avancement | number:'1.1-1' }}%</span>
        </div>
        <div class="progress-bar-track" style="height: 12px">
          <div class="progress-bar-fill"
               [class.success]="avancement < 60"
               [class.warning]="avancement >= 60 && avancement < 85"
               [class.danger]="avancement >= 85"
               [style.width.%]="avancement"></div>
        </div>
      </div>

      <div class="detail-grid">
        <!-- Budgets Section -->
        <div class="glass-panel section-panel animate-in" style="animation-delay: 0.1s">
          <div class="section-header">
            <h3 class="section-title">💰 Budgets</h3>
            <button class="btn btn-primary" style="font-size: 0.8rem; padding: 6px 14px"
                    (click)="showBudgetModal = true">+ Ajouter</button>
          </div>
          @if (budgets.length > 0) {
            <div class="items-list">
              @for (b of budgets; track b.id) {
                <div class="item-row">
                  <div class="item-info">
                    <div class="item-name">{{ b.categorie }}</div>
                    <div class="item-sub">
                      Prévu: {{ b.montantPrevu | number:'1.0-0' }} MAD
                      · Consommé: {{ (b.montantConsomme || 0) | number:'1.0-0' }} MAD
                    </div>
                  </div>
                  <div class="item-actions">
                    <button class="btn btn-icon btn-ghost" (click)="editBudget(b)">✏️</button>
                    <button class="btn btn-icon btn-ghost" (click)="deleteBudget(b.id)">🗑️</button>
                  </div>
                </div>
              }
            </div>
          } @else {
            <div class="empty-mini">Aucun budget</div>
          }
        </div>

        <!-- Taches Section -->
        <div class="glass-panel section-panel animate-in" style="animation-delay: 0.15s">
          <div class="section-header">
            <h3 class="section-title">✅ Tâches</h3>
            <button class="btn btn-primary" style="font-size: 0.8rem; padding: 6px 14px"
                    (click)="showTacheModal = true">+ Ajouter</button>
          </div>
          @if (taches.length > 0) {
            <div class="items-list">
              @for (t of taches; track t.id) {
                <div class="item-row">
                  <div class="item-info">
                    <div class="item-name">{{ t.libelle }}</div>
                    <div class="item-sub">
                      <span class="badge" [class]="getStatusBadge(t.status)">{{ t.status }}</span>
                      <span class="badge badge-violet" style="margin-left: 6px">{{ formatType(t.type) }}</span>
                    </div>
                  </div>
                  <div class="item-actions">
                    <button class="btn btn-icon btn-ghost" (click)="editTache(t)">✏️</button>
                    <button class="btn btn-icon btn-ghost" (click)="deleteTache(t.id)">🗑️</button>
                  </div>
                </div>
              }
            </div>
          } @else {
            <div class="empty-mini">Aucune tâche</div>
          }
        </div>
      </div>

      <!-- Budget Modal -->
      @if (showBudgetModal) {
        <div class="modal-overlay" (click)="closeBudgetModal()">
          <div class="modal-panel" (click)="$event.stopPropagation()">
            <h2>{{ editingBudget ? 'Modifier Budget' : 'Nouveau Budget' }}</h2>
            <div class="form-group" style="margin-bottom: 16px">
              <label>Catégorie</label>
              <input type="text" class="form-control" [(ngModel)]="budgetForm.categorie"
                     placeholder="Ex: Infrastructure, RH...">
            </div>
            <div class="form-group">
              <label>Montant Prévu (MAD)</label>
              <input type="number" class="form-control" [(ngModel)]="budgetForm.montantPrevu"
                     placeholder="Ex: 50000">
            </div>
            <div class="modal-actions">
              <button class="btn btn-ghost" (click)="closeBudgetModal()">Annuler</button>
              <button class="btn btn-primary" (click)="saveBudget()">{{ editingBudget ? 'Modifier' : 'Créer' }}</button>
            </div>
          </div>
        </div>
      }

      <!-- Tache Modal -->
      @if (showTacheModal) {
        <div class="modal-overlay" (click)="closeTacheModal()">
          <div class="modal-panel" (click)="$event.stopPropagation()">
            <h2>{{ editingTache ? 'Modifier Tâche' : 'Nouvelle Tâche' }}</h2>
            <div class="form-group" style="margin-bottom: 16px">
              <label>Libellé</label>
              <input type="text" class="form-control" [(ngModel)]="tacheForm.libelle"
                     placeholder="Nom de la tâche">
            </div>
            <div class="form-row" style="margin-bottom: 16px">
              <div class="form-group">
                <label>Type</label>
                <select class="form-control" [(ngModel)]="tacheForm.type">
                  <option value="">-- Choisir --</option>
                  <option value="SOFTWARE_ENGINEERING">Software Engineering</option>
                  <option value="CYBERSECURITY">Cybersecurity</option>
                  <option value="DATA_SCIENCE">Data Science & Analytics</option>
                  <option value="DEVOPS">DevOps & Infrastructure</option>
                </select>
              </div>
              <div class="form-group">
                <label>Statut</label>
                <select class="form-control" [(ngModel)]="tacheForm.statut">
                  <option value="">-- Choisir --</option>
                  <option value="EN_ATTENTE">En Attente</option>
                  <option value="EN_COURS">En Cours</option>
                  <option value="TERMINEE">Terminée</option>
                </select>
              </div>
            </div>
            <div class="form-group">
              <label>Date d'Échéance</label>
              <input type="date" class="form-control" [(ngModel)]="tacheForm.dateEcheance">
            </div>
            <div class="modal-actions">
              <button class="btn btn-ghost" (click)="closeTacheModal()">Annuler</button>
              <button class="btn btn-primary" (click)="saveTache()">{{ editingTache ? 'Modifier' : 'Créer' }}</button>
            </div>
          </div>
        </div>
      }

      <!-- Toast -->
      @if (toast) {
        <div class="toast-container">
          <div class="toast" [class]="'toast-' + toast.type">{{ toast.message }}</div>
        </div>
      }
    </div>
  `,
  styles: [`
    .back-link {
      font-size: 0.8rem;
      color: var(--text-muted);
      margin-bottom: 4px;
      display: inline-block;
      transition: color var(--transition-fast);
    }
    .back-link:hover { color: var(--accent-blue); }

    .header-actions { display: flex; gap: 8px; }

    .avancement-card { padding: 24px; margin-bottom: 24px; }
    .avancement-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }
    .avancement-header .section-title { margin-bottom: 0; }
    .avancement-value {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--accent-blue);
    }

    .detail-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    .section-panel { padding: 24px; }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }
    .section-header .section-title { margin-bottom: 0; }

    .items-list { display: flex; flex-direction: column; }

    .item-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 14px 0;
      border-bottom: 1px solid var(--border-subtle);
    }
    .item-row:last-child { border-bottom: none; }

    .item-name { font-weight: 500; font-size: 0.9rem; margin-bottom: 4px; }
    .item-sub { font-size: 0.78rem; color: var(--text-muted); display: flex; align-items: center; flex-wrap: wrap; gap: 4px; }
    .item-actions { display: flex; gap: 4px; }

    .empty-mini {
      text-align: center;
      padding: 30px;
      color: var(--text-muted);
      font-size: 0.85rem;
    }

    @media (max-width: 768px) {
      .detail-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class ProjetDetailComponent implements OnInit {
  projet: Projet | null = null;
  budgets: Budget[] = [];
  taches: Tache[] = [];
  avancement = 0;
  projetId!: number;

  showBudgetModal = false;
  showTacheModal = false;
  editingBudget: Budget | null = null;
  editingTache: Tache | null = null;

  budgetForm: BudgetDTO = { montantPrevu: 0, categorie: '' };
  tacheForm: TacheDTO = { libelle: '', dateEcheance: '', statut: '', type: '' };

  toast: { message: string; type: string } | null = null;

  constructor(
    private route: ActivatedRoute,
    private projetService: ProjetService,
    private budgetService: BudgetService,
    private tacheService: TacheService
  ) {}

  ngOnInit() {
    this.projetId = +this.route.snapshot.paramMap.get('id')!;
    this.loadProjet();
  }

  loadProjet() {
    this.projetService.getById(this.projetId).subscribe({
      next: (p) => {
        this.projet = p;
        this.loadBudgets();
        this.loadTaches();
        this.loadAvancement();
      },
      error: () => this.showToast('Projet introuvable', 'error')
    });
  }

  loadBudgets() {
    this.budgetService.getByProjet(this.projetId).subscribe(b => this.budgets = b);
  }

  loadTaches() {
    this.tacheService.getByProjet(this.projetId).subscribe(t => this.taches = t);
  }

  loadAvancement() {
    this.budgetService.getTauxAvancement(this.projetId).subscribe({
      next: (v) => this.avancement = v,
      error: () => this.avancement = 0
    });
  }

  // Budget CRUD
  editBudget(b: Budget) {
    this.editingBudget = b;
    this.budgetForm = { montantPrevu: b.montantPrevu, categorie: b.categorie };
    this.showBudgetModal = true;
  }

  closeBudgetModal() {
    this.showBudgetModal = false;
    this.editingBudget = null;
    this.budgetForm = { montantPrevu: 0, categorie: '' };
  }

  saveBudget() {
    if (this.editingBudget) {
      this.budgetService.update(this.projetId, this.editingBudget.id, this.budgetForm).subscribe({
        next: () => { this.closeBudgetModal(); this.loadBudgets(); this.loadAvancement(); this.showToast('Budget modifié', 'success'); },
        error: (err) => this.showToast(err?.error || 'Erreur de modification', 'error')
      });
    } else {
      this.budgetService.create(this.projetId, this.budgetForm).subscribe({
        next: () => { this.closeBudgetModal(); this.loadBudgets(); this.loadAvancement(); this.showToast('Budget créé', 'success'); },
        error: (err) => this.showToast(err?.error || 'Erreur de création', 'error')
      });
    }
  }

  deleteBudget(id: number) {
    this.budgetService.delete(id).subscribe({
      next: () => { this.loadBudgets(); this.loadAvancement(); this.showToast('Budget supprimé', 'success'); },
      error: () => this.showToast('Erreur de suppression', 'error')
    });
  }

  // Tache CRUD
  editTache(t: Tache) {
    this.editingTache = t;
    this.tacheForm = { libelle: t.libelle, dateEcheance: t.date_echeance, statut: t.status, type: t.type };
    this.showTacheModal = true;
  }

  closeTacheModal() {
    this.showTacheModal = false;
    this.editingTache = null;
    this.tacheForm = { libelle: '', dateEcheance: '', statut: '', type: '' };
  }

  saveTache() {
    if (this.editingTache) {
      this.tacheService.update(this.editingTache.id, this.tacheForm).subscribe({
        next: () => { this.closeTacheModal(); this.loadTaches(); this.showToast('Tâche modifiée', 'success'); },
        error: () => this.showToast('Erreur de modification', 'error')
      });
    } else {
      this.tacheService.create(this.projetId, this.tacheForm).subscribe({
        next: () => { this.closeTacheModal(); this.loadTaches(); this.showToast('Tâche créée', 'success'); },
        error: () => this.showToast('Erreur de création', 'error')
      });
    }
  }

  deleteTache(id: number) {
    this.tacheService.delete(id).subscribe({
      next: () => { this.loadTaches(); this.showToast('Tâche supprimée', 'success'); },
      error: () => this.showToast('Erreur de suppression', 'error')
    });
  }

  cloneProjet() {
    this.projetService.cloner(this.projetId).subscribe({
      next: () => this.showToast('Projet cloné avec succès!', 'success'),
      error: () => this.showToast('Erreur de clonage', 'error')
    });
  }

  genererRapport() {
    this.projetService.genererRapport(this.projetId).subscribe({
      next: (msg) => this.showToast(msg || 'Rapport généré!', 'success'),
      error: () => this.showToast('Erreur de génération', 'error')
    });
  }

  getStatusBadge(status: string): string {
    const map: Record<string, string> = {
      'EN_COURS': 'badge-blue', 'TERMINEE': 'badge-emerald',
      'EN_ATTENTE': 'badge-amber'
    };
    return 'badge ' + (map[status] || 'badge-blue');
  }

  formatType(type: string): string {
    const map: Record<string, string> = {
      'SOFTWARE_ENGINEERING': 'Software Eng.',
      'CYBERSECURITY': 'Cybersecurity',
      'DATA_SCIENCE': 'Data Science',
      'DEVOPS': 'DevOps',
      'GENIE_CIVIL': 'Génie Civil',
      'ELECTRICITE': 'Électricité'
    };
    return map[type] || type;
  }

  showToast(message: string, type: string) {
    this.toast = { message, type };
    setTimeout(() => this.toast = null, 3000);
  }
}
