export interface Projet {
  id: number;
  nomProjet: string;
  budgets?: Budget[];
  taches?: Tache[];
}

export interface ProjetDTO {
  nomProjet: string;
}

export interface Budget {
  id: number;
  montantPrevu: number;
  montantConsomme: number;
  categorie: string;
  projet?: Projet;
}

export interface BudgetDTO {
  montantPrevu: number;
  categorie: string;
}

export interface Tache {
  id: number;
  libelle: string;
  // Fix #4: backend serializes as dateEcheance (camelCase), not date_echeance.
  dateEcheance: string;
  status: string;
  type: string;
  projet?: Projet;
}

export interface TacheDTO {
  libelle: string;
  dateEcheance: string;
  statut: string;
  type: string;
}

export interface Depense {
  id: number;
  montant: number;
  dateDepense: string;
  description: string;
  tache?: Tache;
}

export interface DepenseDTO {
  montant: number;
  description: string;
  dateDepense: string;
}

export interface InitProjetRequest {
  projetDTO: ProjetDTO;
  budgetDTO: BudgetDTO;
  tachesAvecDepenses: { [key: string]: DepenseDTO };
}
