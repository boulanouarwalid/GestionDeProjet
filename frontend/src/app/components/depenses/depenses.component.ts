import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DepenseService } from '../../services/depense.service';
import { TacheService } from '../../services/tache.service';
import { ProjetService } from '../../services/projet.service';
import { Depense, DepenseDTO, Tache, Projet } from '../../models/models';

@Component({
  selector: 'app-depenses',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './depenses.component.html',
  styleUrl: './depenses.component.css'
})
export class DepensesComponent implements OnInit {
  projets: Projet[] = [];
  taches: Tache[] = [];
  depenses: Depense[] = [];
  selectedProjetId = 0;
  selectedTacheId = 0;

  showModal = false;
  editing: Depense | null = null;
  modalTacheId = 0;
  form: DepenseDTO = { montant: 0, description: '', dateDepense: '' };
  depenseToDelete: Depense | null = null;
  toast: { message: string; type: string } | null = null;

  constructor(
    private depenseService: DepenseService,
    private tacheService: TacheService,
    private projetService: ProjetService
  ) {}

  ngOnInit() {
    this.projetService.getAll().subscribe(p => this.projets = p);
    this.loadAllDepenses();
  }

  loadAllDepenses() {
    this.depenseService.getAll().subscribe(d => this.depenses = d);
  }

  onProjetChange() {
    this.selectedTacheId = 0;
    if (this.selectedProjetId > 0) {
      this.tacheService.getByProjet(this.selectedProjetId).subscribe(t => this.taches = t);
    } else {
      this.taches = [];
    }
    this.loadDepenses();
  }

  loadDepenses() {
    if (this.selectedTacheId > 0) {
      this.depenseService.getByTache(this.selectedTacheId).subscribe(d => this.depenses = d);
    } else {
      this.loadAllDepenses();
    }
  }

  editDepense(d: Depense) {
    this.editing = d;
    this.form = { montant: d.montant, description: d.description, dateDepense: d.dateDepense };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.editing = null;
    this.form = { montant: 0, description: '', dateDepense: '' };
    this.modalTacheId = 0;
  }

  save() {
    if (this.editing) {
      this.depenseService.update(this.editing.id, this.form).subscribe({
        next: () => { this.closeModal(); this.loadDepenses(); this.showToast('Dépense modifiée', 'success'); },
        error: (e) => this.handleError(e)
      });
    } else {
      const tid = this.modalTacheId || this.selectedTacheId;
      if (!tid) { this.showToast('Choisissez une tâche', 'error'); return; }
      this.depenseService.create(tid, this.form).subscribe({
        next: () => { this.closeModal(); this.loadDepenses(); this.showToast('Dépense créée', 'success'); },
        error: (e) => this.handleError(e)
      });
    }
  }

  confirmDelete(d: Depense) { this.depenseToDelete = d; }

  deleteDepense() {
    if (!this.depenseToDelete) return;
    this.depenseService.delete(this.depenseToDelete.id).subscribe({
      next: () => { this.depenseToDelete = null; this.loadDepenses(); this.showToast('Dépense supprimée', 'success'); },
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
    this.toast = { message, type };
    setTimeout(() => this.toast = null, 3000);
  }
}
