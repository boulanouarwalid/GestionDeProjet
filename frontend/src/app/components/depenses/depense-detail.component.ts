import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DepenseService } from '../../services/depense.service';
import { TacheService } from '../../services/tache.service';
import { ProjetService } from '../../services/projet.service';
import { DataCacheService } from '../../services/data-cache.service';
import { Depense, DepenseDTO, Tache, Projet, Budget } from '../../models/models';
import { Subscription } from 'rxjs';

interface ExpenseAnalytics {
  totalExpenses: number;
  averageExpense: number;
  highestExpense: number;
  lowestExpense: number;
  expenseCount: number;
  monthlyTrend: { month: string; amount: number }[];
  categoryBreakdown: { category: string; amount: number; count: number }[];
}

interface BudgetComparison {
  totalBudget: number;
  totalSpent: number;
  remaining: number;
  utilizationRate: number;
  budgetByCategory: { category: string; budget: number; spent: number; remaining: number }[];
}

@Component({
  selector: 'app-depense-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="detail-page">
      <!-- Header Section -->
      <header class="detail-header animate-in">
        <div class="header-content">
          <div class="header-info">
            <div class="breadcrumb">
              <span class="breadcrumb-item">Projets</span>
              <span class="breadcrumb-separator">/</span>
              <span class="breadcrumb-item">{{ selectedProjet?.nomProjet || 'Tous les projets' }}</span>
              @if (selectedTache) {
                <span class="breadcrumb-separator">/</span>
                <span class="breadcrumb-item">{{ selectedTache.libelle }}</span>
              }
            </div>
            <h1 class="page-title">Analyse des Dépenses</h1>
            <p class="page-subtitle">Vue détaillée et analytics des dépenses</p>
          </div>
          <div class="header-actions">
            <button class="btn btn-ghost" (click)="refreshData()">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M1 8a7 7 0 1 0 7-7M1 8V4M1 8h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Actualiser
            </button>
            <div class="dropdown" [class.show]="showExportMenu">
              <button class="btn btn-primary" (click)="toggleExportMenu()">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 12h12M8 2v8M5 7l3 3 3-3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Exporter
              </button>
              @if (showExportMenu) {
                <div class="dropdown-menu">
                  <button class="dropdown-item" (click)="exportData('pdf')">📄 PDF</button>
                  <button class="dropdown-item" (click)="exportData('excel')">📊 Excel</button>
                  <button class="dropdown-item" (click)="exportData('csv')">📋 CSV</button>
                </div>
              }
            </div>
          </div>
        </div>
      </header>

      <!-- Filters Section -->
      <div class="glass-panel filter-section animate-in" style="animation-delay:0.05s">
        <div class="filter-row">
          <div class="filter-group">
            <label>Période</label>
            <select class="form-control" [(ngModel)]="selectedPeriod" (change)="onPeriodChange()">
              <option value="all">Toutes les périodes</option>
              <option value="current-month">Mois en cours</option>
              <option value="last-month">Mois dernier</option>
              <option value="current-quarter">Trimestre en cours</option>
              <option value="current-year">Année en cours</option>
            </select>
          </div>
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
              <label>Tâche</label>
              <select class="form-control" [(ngModel)]="selectedTacheId" (change)="onTacheChange()">
                <option [ngValue]="0">Toutes les tâches</option>
                @for (t of taches; track t.id) {
                  <option [ngValue]="t.id">{{ t.libelle }}</option>
                }
              </select>
            </div>
          }
          <div class="filter-group">
            <label>Montant min</label>
            <input type="number" class="form-control" [(ngModel)]="minAmount" (input)="applyFilters()" placeholder="0">
          </div>
          <div class="filter-group">
            <label>Montant max</label>
            <input type="number" class="form-control" [(ngModel)]="maxAmount" (input)="applyFilters()" placeholder="∞">
          </div>
        </div>
      </div>

      <!-- Key Metrics Cards -->
      <div class="metrics-grid animate-in" style="animation-delay:0.1s">
        <div class="metric-card">
          <div class="metric-icon jade">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="metric-content">
            <div class="metric-label">Total Dépensé</div>
            <div class="metric-value">{{ analytics.totalExpenses | number:'1.0-0' }} MAD</div>
            <div class="metric-change positive">{{ analytics.expenseCount }} dépenses</div>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-icon blue">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M16 8v8a4 4 0 0 1-8 0V8M8 8h8M4 8h16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="metric-content">
            <div class="metric-label">Moyenne</div>
            <div class="metric-value">{{ analytics.averageExpense | number:'1.0-0' }} MAD</div>
            <div class="metric-change">Par dépense</div>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-icon violet">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="metric-content">
            <div class="metric-label">Plus Élevée</div>
            <div class="metric-value">{{ analytics.highestExpense | number:'1.0-0' }} MAD</div>
            <div class="metric-change">Maximum</div>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-icon orange">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
              <path d="M12 6v6l4 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="metric-content">
            <div class="metric-label">Budget Utilisé</div>
            <div class="metric-value">{{ budgetComparison.utilizationRate | number:'1.0-0' }}%</div>
            <div class="metric-change">{{ budgetComparison.remaining | number:'1.0-0' }} MAD restants</div>
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="charts-grid animate-in" style="animation-delay:0.15s">
        <!-- Monthly Trend Chart -->
        <div class="chart-card">
          <div class="chart-header">
            <h3>Tendance Mensuelle</h3>
            <div class="chart-actions">
              <button class="btn btn-icon btn-ghost" (click)="toggleChartType('trend')">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M1 12h14M2 8h12M3 4h10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
              </button>
            </div>
          </div>
          <div class="chart-content">
            <div class="simple-chart">
              @for (item of analytics.monthlyTrend; track item.month) {
                <div class="chart-bar">
                  <div class="bar" [style.height.%]="getBarHeight(item.amount, analytics.monthlyTrend)"></div>
                  <div class="bar-label">{{ item.month }}</div>
                  <div class="bar-value">{{ item.amount | number:'1.0-0' }}</div>
                </div>
              }
            </div>
          </div>
        </div>

        <!-- Category Breakdown -->
        <div class="chart-card">
          <div class="chart-header">
            <h3>Répartition par Catégorie</h3>
            <div class="chart-actions">
              <button class="btn btn-icon btn-ghost" (click)="toggleChartType('category')">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5"/>
                  <path d="M8 2v6l4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
          <div class="chart-content">
            <div class="category-list">
              @for (cat of analytics.categoryBreakdown; track cat.category) {
                <div class="category-item">
                  <div class="category-info">
                    <div class="category-dot" [style.background-color]="getCategoryColor(cat.category)"></div>
                    <span class="category-name">{{ cat.category }}</span>
                  </div>
                  <div class="category-stats">
                    <span class="category-amount">{{ cat.amount | number:'1.0-0' }} MAD</span>
                    <span class="category-count">{{ cat.count }} dép.</span>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      </div>

      <!-- Budget Comparison Section -->
      <div class="budget-section glass-panel animate-in" style="animation-delay:0.2s">
        <div class="section-header">
          <h3>Comparaison Budget vs Réel</h3>
          <div class="budget-summary">
            <span class="budget-total">Budget: {{ budgetComparison.totalBudget | number:'1.0-0' }} MAD</span>
            <span class="budget-spent">Dépensé: {{ budgetComparison.totalSpent | number:'1.0-0' }} MAD</span>
            <span class="budget-remaining">Restant: {{ budgetComparison.remaining | number:'1.0-0' }} MAD</span>
          </div>
        </div>
        <div class="budget-progress">
          <div class="progress-bar">
            <div class="progress-fill" [style.width.%]="budgetComparison.utilizationRate"></div>
          </div>
          <div class="progress-labels">
            <span>0%</span>
            <span>{{ budgetComparison.utilizationRate | number:'1.0-0' }}%</span>
            <span>100%</span>
          </div>
        </div>
        @if (budgetComparison.budgetByCategory.length > 0) {
          <div class="budget-by-category">
            @for (budget of budgetComparison.budgetByCategory; track budget.category) {
              <div class="budget-category-item">
                <div class="budget-category-header">
                  <span>{{ budget.category }}</span>
                  <span>{{ budget.spent | number:'1.0-0' }} / {{ budget.budget | number:'1.0-0' }} MAD</span>
                </div>
                <div class="budget-category-progress">
                  <div class="progress-bar small">
                    <div class="progress-fill" [style.width.%]="(budget.spent / budget.budget) * 100"></div>
                  </div>
                </div>
              </div>
            }
          </div>
        }
      </div>

      <!-- Timeline Section -->
      <div class="timeline-section glass-panel animate-in" style="animation-delay:0.25s">
        <div class="section-header">
          <h3>Chronologie des Dépenses</h3>
          <div class="timeline-controls">
            <button class="btn btn-ghost" (click)="toggleTimelineView()">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
              {{ timelineView === 'list' ? 'Vue Grille' : 'Vue Liste' }}
            </button>
          </div>
        </div>
        <div class="timeline-content">
          @if (timelineView === 'list') {
            <div class="timeline-list">
              @for (expense of filteredExpenses; track expense.id) {
                <div class="timeline-item">
                  <div class="timeline-date">
                    <div class="date-day">{{ getDay(expense.dateDepense) }}</div>
                    <div class="date-month">{{ getMonth(expense.dateDepense) }}</div>
                  </div>
                  <div class="timeline-content-item">
                    <div class="expense-header">
                      <h4>{{ expense.description || 'Dépense sans description' }}</h4>
                      <span class="expense-amount">{{ expense.montant | number:'1.0-0' }} MAD</span>
                    </div>
                    <div class="expense-details">
                      <span class="expense-task">{{ expense.tache ? expense.tache.libelle : '' }}</span>
                      <span class="expense-date">{{ formatDate(expense.dateDepense) }}</span>
                    </div>
                  </div>
                </div>
              }
            </div>
          } @else {
            <div class="timeline-grid">
              @for (expense of filteredExpenses; track expense.id) {
                <div class="expense-card">
                  <div class="expense-card-header">
                    <span class="expense-amount">{{ expense.montant | number:'1.0-0' }} MAD</span>
                    <span class="expense-date">{{ formatDateShort(expense.dateDepense) }}</span>
                  </div>
                  <div class="expense-card-content">
                    <h4>{{ expense.description || 'Sans description' }}</h4>
                    <p>{{ expense.tache ? expense.tache.libelle : '' }}</p>
                  </div>
                </div>
              }
            </div>
          }
        </div>
      </div>

      <!-- Toast Notification -->
      @if (toast) {
        <div class="toast-container">
          <div class="toast" [class]="'toast-' + toast.type">{{ toast.message }}</div>
        </div>
      }
    </div>
  `,
  styleUrls: ['./depense-detail.component.css']
})
export class DepenseDetailComponent implements OnInit, OnDestroy {
  @Input() projetId?: number;
  @Input() tacheId?: number;

  projets: Projet[] = [];
  allTaches: Tache[] = [];
  taches: Tache[] = [];
  depenses: Depense[] = [];
  filteredExpenses: Depense[] = [];
  budgets: Budget[] = [];

  selectedProjetId = 0;
  selectedTacheId = 0;
  selectedPeriod = 'all';
  minAmount: number | null = null;
  maxAmount: number | null = null;

  timelineView: 'list' | 'grid' = 'list';
  showExportMenu = false;

  analytics: ExpenseAnalytics = {
    totalExpenses: 0,
    averageExpense: 0,
    highestExpense: 0,
    lowestExpense: 0,
    expenseCount: 0,
    monthlyTrend: [],
    categoryBreakdown: []
  };

  budgetComparison: BudgetComparison = {
    totalBudget: 0,
    totalSpent: 0,
    remaining: 0,
    utilizationRate: 0,
    budgetByCategory: []
  };

  toast: { message: string; type: string } | null = null;
  private subs: Subscription[] = [];

  constructor(
    private depenseService: DepenseService,
    private tacheService: TacheService,
    private projetService: ProjetService,
    private cache: DataCacheService
  ) {}

  ngOnInit() {
    this.subs.push(this.cache.projets$.subscribe(p => this.projets = p));
    this.subs.push(this.cache.taches$.subscribe(t => {
      this.allTaches = t;
      this.taches = t;
    }));
    this.subs.push(this.cache.depenses$.subscribe(d => {
      this.depenses = d;
      this.filteredExpenses = d;
      this.updateAnalytics();
      this.updateBudgetComparison();
    }));

    if (this.projetId) {
      this.selectedProjetId = this.projetId;
    }
    if (this.tacheId) {
      this.selectedTacheId = this.tacheId;
    }

    this.cache.init();
  }

  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe());
  }

  get selectedProjet(): Projet | undefined {
    return this.projets.find(p => p.id === this.selectedProjetId);
  }

  get selectedTache(): Tache | undefined {
    return this.taches.find(t => t.id === this.selectedTacheId);
  }

  onProjetChange() {
    this.selectedTacheId = 0;
    if (this.selectedProjetId > 0) {
      this.taches = this.allTaches.filter(t => t.projet?.id === this.selectedProjetId);
    } else {
      this.taches = this.allTaches;
    }
    this.applyFilters();
  }

  onTacheChange() {
    this.applyFilters();
  }

  onPeriodChange() {
    this.applyFilters();
  }

  applyFilters() {
    let filtered = [...this.depenses];

    // Filter by project
    if (this.selectedProjetId > 0) {
      filtered = filtered.filter(d => d.tache?.projet?.id === this.selectedProjetId);
    }

    // Filter by task
    if (this.selectedTacheId > 0) {
      filtered = filtered.filter(d => d.tache?.id === this.selectedTacheId);
    }

    // Filter by period
    if (this.selectedPeriod !== 'all') {
      const now = new Date();
      const startDate = this.getPeriodStartDate(this.selectedPeriod, now);
      filtered = filtered.filter(d => new Date(d.dateDepense) >= startDate);
    }

    // Filter by amount
    if (this.minAmount !== null) {
      filtered = filtered.filter(d => d.montant >= this.minAmount!);
    }
    if (this.maxAmount !== null) {
      filtered = filtered.filter(d => d.montant <= this.maxAmount!);
    }

    this.filteredExpenses = filtered;
    this.updateAnalytics();
    this.updateBudgetComparison();
  }

  getPeriodStartDate(period: string, now: Date): Date {
    const start = new Date(now);
    
    switch (period) {
      case 'current-month':
        start.setDate(1);
        start.setHours(0, 0, 0, 0);
        break;
      case 'last-month':
        start.setMonth(start.getMonth() - 1);
        start.setDate(1);
        start.setHours(0, 0, 0, 0);
        break;
      case 'current-quarter':
        const quarter = Math.floor(start.getMonth() / 3);
        start.setMonth(quarter * 3);
        start.setDate(1);
        start.setHours(0, 0, 0, 0);
        break;
      case 'current-year':
        start.setMonth(0);
        start.setDate(1);
        start.setHours(0, 0, 0, 0);
        break;
    }
    
    return start;
  }

  updateAnalytics() {
    const expenses = this.filteredExpenses;
    
    this.analytics.totalExpenses = expenses.reduce((sum, e) => sum + e.montant, 0);
    this.analytics.expenseCount = expenses.length;
    this.analytics.averageExpense = expenses.length > 0 ? this.analytics.totalExpenses / expenses.length : 0;
    this.analytics.highestExpense = expenses.length > 0 ? Math.max(...expenses.map(e => e.montant)) : 0;
    this.analytics.lowestExpense = expenses.length > 0 ? Math.min(...expenses.map(e => e.montant)) : 0;

    // Monthly trend
    this.analytics.monthlyTrend = this.calculateMonthlyTrend(expenses);
    
    // Category breakdown
    this.analytics.categoryBreakdown = this.calculateCategoryBreakdown(expenses);
  }

  calculateMonthlyTrend(expenses: Depense[]): { month: string; amount: number }[] {
    const monthlyData: { [key: string]: number } = {};
    
    expenses.forEach(expense => {
      const date = new Date(expense.dateDepense);
      const monthKey = date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
      monthlyData[monthKey] = (monthlyData[monthKey] || 0) + expense.montant;
    });

    return Object.entries(monthlyData)
      .map(([month, amount]) => ({ month, amount }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-6); // Last 6 months
  }

  calculateCategoryBreakdown(expenses: Depense[]): { category: string; amount: number; count: number }[] {
    const categoryData: { [key: string]: { amount: number; count: number } } = {};
    
    expenses.forEach(expense => {
      const category = expense.tache?.type || 'Non catégorisé';
      if (!categoryData[category]) {
        categoryData[category] = { amount: 0, count: 0 };
      }
      categoryData[category].amount += expense.montant;
      categoryData[category].count += 1;
    });

    return Object.entries(categoryData)
      .map(([category, data]) => ({ category, ...data }))
      .sort((a, b) => b.amount - a.amount);
  }

  updateBudgetComparison() {
    // This would typically come from budget service
    // For now, we'll use mock data based on the filtered expenses
    const totalSpent = this.analytics.totalExpenses;
    const totalBudget = totalSpent * 1.2; // Mock: 20% more budget than spent
    
    this.budgetComparison = {
      totalBudget,
      totalSpent,
      remaining: totalBudget - totalSpent,
      utilizationRate: totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0,
      budgetByCategory: this.analytics.categoryBreakdown.map(cat => ({
        category: cat.category,
        budget: cat.amount * 1.2, // Mock budget
        spent: cat.amount,
        remaining: cat.amount * 0.2
      }))
    };
  }

  getBarHeight(amount: number, data: { month: string; amount: number }[]): number {
    const maxAmount = Math.max(...data.map(d => d.amount));
    return maxAmount > 0 ? (amount / maxAmount) * 100 : 0;
  }

  getCategoryColor(category: string): string {
    const colors = [
      '#8b5cf6', '#3b82f6', '#22c55e', '#f97316', '#ef4444',
      '#06b6d4', '#a855f7', '#10b981', '#f59e0b', '#6366f1'
    ];
    const index = category.charCodeAt(0) % colors.length;
    return colors[index];
  }

  toggleExportMenu() {
    this.showExportMenu = !this.showExportMenu;
  }

  exportData(format: string) {
    this.showExportMenu = false;
    // Implementation would depend on the export library
    this.showToast(`Export ${format.toUpperCase()} en cours...`, 'success');
  }

  toggleTimelineView() {
    this.timelineView = this.timelineView === 'list' ? 'grid' : 'list';
  }

  refreshData() {
    this.cache.refreshDepenses();
    this.showToast('Données actualisées', 'success');
  }

  getDay(dateString: string): string {
    return new Date(dateString).getDate().toString();
  }

  getMonth(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fr-FR', { month: 'short' }).toUpperCase();
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  formatDateShort(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short'
    });
  }

  toggleChartType(type: string) {
    // Placeholder for chart type switching
    this.showToast(`Type de graphique ${type} sélectionné`, 'info');
  }

  showToast(message: string, type: string) {
    this.toast = { message, type };
    setTimeout(() => this.toast = null, 3000);
  }
}
