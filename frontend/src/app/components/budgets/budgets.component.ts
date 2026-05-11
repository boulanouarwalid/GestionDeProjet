import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BudgetService } from '../../services/budget.service';
import { ProjetService } from '../../services/projet.service';
import { Budget, BudgetDTO, Projet } from '../../models/models';

@Component({
  selector: 'app-budgets',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './budgets.component.html',
  styleUrl: './budgets.component.css'
})
export class BudgetsComponent implements OnInit {
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

  constructor(private budgetService: BudgetService, private projetService: ProjetService) {}

  ngOnInit() { this.projetService.getAll().subscribe(p => this.projets = p); }

  loadBudgets() {
    if (this.selectedProjetId <= 0) { this.budgets = []; return; }
    this.budgetService.getByProjet(this.selectedProjetId).subscribe(b => this.budgets = b);
    this.budgetService.getTauxAvancement(this.selectedProjetId).subscribe({
      next: (v) => this.avancement = v, error: () => this.avancement = 0
    });
  }

  getConsumptionPercent(b: Budget): number {
    if (!b.montantPrevu || b.montantPrevu <= 0) return 0;
    return Math.min(((b.montantConsomme || 0) / b.montantPrevu) * 100, 100);
  }

  editBudget(b: Budget) {
    this.editing = b;
    this.form = { montantPrevu: b.montantPrevu, categorie: b.categorie };
    this.modalProjetId = this.selectedProjetId;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false; this.editing = null;
    this.form = { montantPrevu: 0, categorie: '' }; this.modalProjetId = 0;
  }

  save() {
    const pid = this.editing ? this.selectedProjetId : (this.modalProjetId || this.selectedProjetId);
    if (!pid) { this.showToast('Choisissez un projet', 'error'); return; }
    if (this.editing) {
      this.budgetService.update(pid, this.editing.id, this.form).subscribe({
        next: () => { this.closeModal(); this.loadBudgets(); this.showToast('Budget modifié', 'success'); },
        error: (e) => this.handleError(e)
      });
    } else {
      this.budgetService.create(pid, this.form).subscribe({
        next: () => { this.closeModal(); if (this.selectedProjetId === pid) this.loadBudgets(); this.showToast('Budget créé', 'success'); },
        error: (e) => this.handleError(e)
      });
    }
  }

  confirmDelete(b: Budget) { this.budgetToDelete = b; }

  deleteBudget() {
    if (!this.budgetToDelete) return;
    this.budgetService.delete(this.budgetToDelete.id).subscribe({
      next: () => { this.budgetToDelete = null; this.loadBudgets(); this.showToast('Budget supprimé', 'success'); },
      error: (e) => this.handleError(e)
    });
  }

  handleError(e: any) {
    if (e?.error?.errors) {
      const messages = Object.values(e.error.errors).join(', ');
      this.showToast(messages, 'error');
    } else if (e?.error?.message) {
      this.showToast(e.error.message, 'error');
    } else if (typeof e?.error === 'string') {
      this.showToast(e.error, 'error');
    } else {
      this.showToast('Une erreur est survenue', 'error');
    }
  }

  showToast(message: string, type: string) {
    this.toast = { message, type }; setTimeout(() => this.toast = null, 3000);
  }
}
