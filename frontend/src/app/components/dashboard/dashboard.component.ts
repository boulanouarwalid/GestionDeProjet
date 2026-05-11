import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProjetService } from '../../services/projet.service';
import { TacheService } from '../../services/tache.service';
import { DepenseService } from '../../services/depense.service';
import { Projet, Tache, Depense } from '../../models/models';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard">
      <div class="page-header">
        <div>
          <h1 class="page-title">Dashboard</h1>
          <p class="page-subtitle">Vue d'ensemble de vos projets et ressources</p>
        </div>
      </div>

      <div class="stats-grid">
        <div class="stat-card blue animate-in">
          <div class="stat-icon blue"><i class="bi bi-folder-fill"></i></div>
          <div class="stat-value">{{ totalProjets }}</div>
          <div class="stat-label">Projets</div>
        </div>
        <div class="stat-card emerald animate-in" style="animation-delay: 0.05s">
          <div class="stat-icon emerald"><i class="bi bi-check2-square"></i></div>
          <div class="stat-value">{{ totalTaches }}</div>
          <div class="stat-label">Taches</div>
        </div>
        <div class="stat-card amber animate-in" style="animation-delay: 0.1s">
          <div class="stat-icon amber"><i class="bi bi-wallet2"></i></div>
          <div class="stat-value">{{ totalBudget | number:'1.0-0' }}</div>
          <div class="stat-label">Budget Total (MAD)</div>
        </div>
        <div class="stat-card violet animate-in" style="animation-delay: 0.15s">
          <div class="stat-icon violet"><i class="bi bi-credit-card"></i></div>
          <div class="stat-value">{{ totalDepenses | number:'1.0-0' }}</div>
          <div class="stat-label">Depenses Total (MAD)</div>
        </div>
      </div>

      <div class="charts-row">
        <div class="glass-panel chart-card animate-in" style="animation-delay: 0.2s">
          <h3 class="section-title"><i class="bi bi-bar-chart-fill"></i> Taches par Type</h3>
          <div class="chart-bars">
            @for (item of taskTypeStats; track item.type) {
              <div class="chart-bar-row">
                <div class="bar-label">{{ item.type }}</div>
                <div class="bar-track">
                  <div class="bar-fill" [style.width.%]="item.percent" [class]="item.color"></div>
                </div>
                <div class="bar-value">{{ item.count }}</div>
              </div>
            }
            @if (taskTypeStats.length === 0) {
              <div class="empty-state" style="padding: 30px">
                <div class="empty-state-text">Aucune tache enregistree</div>
              </div>
            }
          </div>
        </div>

        <div class="glass-panel chart-card animate-in" style="animation-delay: 0.25s">
          <h3 class="section-title"><i class="bi bi-lightning-charge"></i> Taches par Statut</h3>
          <div class="status-circles">
            @for (item of taskStatusStats; track item.status) {
              <div class="status-item">
                <div class="status-ring" [style.background]="item.gradient">
                  <span>{{ item.count }}</span>
                </div>
                <div class="status-name">{{ item.status }}</div>
              </div>
            }
            @if (taskStatusStats.length === 0) {
              <div class="empty-state" style="padding: 30px">
                <div class="empty-state-text">Aucune tache enregistree</div>
              </div>
            }
          </div>
        </div>
      </div>

      <div class="glass-panel recent-section animate-in" style="animation-delay: 0.3s">
        <div class="section-header">
          <h3 class="section-title"><i class="bi bi-folder-fill"></i> Projets Recents</h3>
          <a routerLink="/projets" class="btn btn-ghost" style="font-size: 0.8rem;">Voir Tout <i class="bi bi-arrow-right"></i></a>
        </div>
        @if (projets.length > 0) {
          <table class="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nom du Projet</th>
                <th>Taches</th>
                <th>Budgets</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (p of projets.slice(0, 5); track p.id) {
                <tr>
                  <td>#{{ p.id }}</td>
                  <td>{{ p.nomProjet }}</td>
                  <td><span class="badge badge-blue">{{ p.taches?.length || 0 }}</span></td>
                  <td><span class="badge badge-emerald">{{ p.budgets?.length || 0 }}</span></td>
                  <td>
                    <a [routerLink]="['/projets', p.id]" class="btn btn-ghost btn-icon" title="Details"><i class="bi bi-eye"></i></a>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        } @else {
          <div class="empty-state">
            <div class="empty-state-icon"><i class="bi bi-folder" style="font-size:3rem;opacity:0.3"></i></div>
            <div class="empty-state-text">Aucun projet. Creez votre premier projet!</div>
            <a routerLink="/projets" class="btn btn-primary"><i class="bi bi-plus"></i> Nouveau Projet</a>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .dashboard { animation: fadeIn 0.3s ease; }
    .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 28px; }
    .charts-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 28px; }
    .chart-card { padding: 24px; }
    .chart-bars { display: flex; flex-direction: column; gap: 14px; }
    .chart-bar-row { display: flex; align-items: center; gap: 12px; }
    .bar-label { width: 140px; font-size: 0.8rem; color: var(--text-secondary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .bar-track { flex: 1; height: 10px; background: rgba(255,255,255,0.05); border-radius: 5px; overflow: hidden; }
    .bar-fill { height: 100%; border-radius: 5px; transition: width 0.8s ease; }
    .bar-fill.fill-blue { background: var(--gradient-blue); }
    .bar-fill.fill-emerald { background: var(--gradient-emerald); }
    .bar-fill.fill-amber { background: var(--gradient-amber); }
    .bar-fill.fill-violet { background: var(--gradient-violet); }
    .bar-fill.fill-rose { background: var(--gradient-rose); }
    .bar-fill.fill-cyan { background: linear-gradient(135deg, #06b6d4, #0891b2); }
    .bar-value { width: 30px; text-align: right; font-size: 0.85rem; font-weight: 600; color: var(--text-primary); }
    .status-circles { display: flex; justify-content: space-around; flex-wrap: wrap; gap: 20px; padding: 20px 0; }
    .status-item { display: flex; flex-direction: column; align-items: center; gap: 10px; }
    .status-ring { width: 64px; height: 64px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; font-weight: 700; color: white; box-shadow: var(--shadow-md); }
    .status-name { font-size: 0.75rem; color: var(--text-muted); font-weight: 500; text-transform: capitalize; }
    .recent-section { padding: 24px; }
    .section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
    .section-header .section-title { margin-bottom: 0; }
    @media (max-width: 1024px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } .charts-row { grid-template-columns: 1fr; } }
    @media (max-width: 640px) { .stats-grid { grid-template-columns: 1fr; } }
  `]
})
export class DashboardComponent implements OnInit {
  projets: Projet[] = [];
  taches: Tache[] = [];
  depenses: Depense[] = [];
  totalProjets = 0;
  totalTaches = 0;
  totalBudget = 0;
  totalDepenses = 0;
  taskTypeStats: { type: string; count: number; percent: number; color: string }[] = [];
  taskStatusStats: { status: string; count: number; gradient: string }[] = [];

  constructor(private projetService: ProjetService, private tacheService: TacheService, private depenseService: DepenseService) {}

  ngOnInit() { this.loadData(); }

  loadData() {
    forkJoin({ projets: this.projetService.getAll(), taches: this.tacheService.getAll(), depenses: this.depenseService.getAll() }).subscribe({
      next: (data) => {
        this.projets = data.projets; this.taches = data.taches; this.depenses = data.depenses;
        this.totalProjets = data.projets.length; this.totalTaches = data.taches.length;
        this.totalDepenses = data.depenses.reduce((sum, d) => sum + (d.montant || 0), 0);
        let budgetSum = 0;
        data.projets.forEach(p => { if (p.budgets) { p.budgets.forEach(b => budgetSum += (b.montantPrevu || 0)); } });
        this.totalBudget = budgetSum;
        this.calculateTaskTypeStats(); this.calculateTaskStatusStats();
      },
      error: (err) => console.error('Dashboard load error:', err)
    });
  }

  private calculateTaskTypeStats() {
    const colors = ['fill-blue', 'fill-emerald', 'fill-amber', 'fill-violet', 'fill-rose', 'fill-cyan'];
    const typeMap = new Map<string, number>();
    this.taches.forEach(t => { const type = t.type || 'Inconnu'; typeMap.set(type, (typeMap.get(type) || 0) + 1); });
    const max = Math.max(...Array.from(typeMap.values()), 1);
    let i = 0;
    this.taskTypeStats = Array.from(typeMap.entries()).map(([type, count]) => ({ type: this.formatType(type), count, percent: (count / max) * 100, color: colors[i++ % colors.length] }));
  }

  private calculateTaskStatusStats() {
    const gradients = ['linear-gradient(135deg, #3b82f6, #2563eb)', 'linear-gradient(135deg, #10b981, #059669)', 'linear-gradient(135deg, #f59e0b, #d97706)', 'linear-gradient(135deg, #f43f5e, #e11d48)', 'linear-gradient(135deg, #8b5cf6, #7c3aed)'];
    const statusMap = new Map<string, number>();
    this.taches.forEach(t => { const status = t.status || 'Inconnu'; statusMap.set(status, (statusMap.get(status) || 0) + 1); });
    let i = 0;
    this.taskStatusStats = Array.from(statusMap.entries()).map(([status, count]) => ({ status, count, gradient: gradients[i++ % gradients.length] }));
  }

  private formatType(type: string): string {
    const map: Record<string, string> = { 'SOFTWARE_ENGINEERING': 'Software Eng.', 'CYBERSECURITY': 'Cybersecurity', 'DATA_SCIENCE': 'Data Science', 'DEVOPS': 'DevOps', 'GENIE_CIVIL': 'Genie Civil', 'ELECTRICITE': 'Electricite' };
    return map[type] || type;
  }
}
