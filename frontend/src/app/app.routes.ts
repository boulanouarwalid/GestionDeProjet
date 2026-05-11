import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProjetsComponent } from './components/projets/projets.component';
import { ProjetDetailComponent } from './components/projets/projet-detail.component';
import { TachesComponent } from './components/taches/taches.component';
import { BudgetsComponent } from './components/budgets/budgets.component';
import { DepensesComponent } from './components/depenses/depenses.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'projets', component: ProjetsComponent },
  { path: 'projets/:id', component: ProjetDetailComponent },
  { path: 'taches', component: TachesComponent },
  { path: 'budgets', component: BudgetsComponent },
  { path: 'depenses', component: DepensesComponent },
  { path: '**', redirectTo: 'dashboard' }
];
