import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProjetsComponent } from './components/projets/projets.component';
import { TachesComponent } from './components/taches/taches.component';
import { BudgetsComponent } from './components/budgets/budgets.component';
import { DepensesComponent } from './components/depenses/depenses.component';
import { DepenseDetailComponent } from './components/depenses/depense-detail.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'projets', component: ProjetsComponent },
  { path: 'taches', component: TachesComponent },
  { path: 'budgets', component: BudgetsComponent },
  { path: 'depenses', component: DepensesComponent },
  { path: 'depenses/detail', component: DepenseDetailComponent },
  { path: 'depenses/detail/:projetId', component: DepenseDetailComponent },
  { path: 'depenses/detail/:projetId/:tacheId', component: DepenseDetailComponent },
  { path: '**', redirectTo: 'dashboard' }
];
