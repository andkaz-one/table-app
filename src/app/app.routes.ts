import { Routes } from '@angular/router';

export const routes: Routes = [
  {path: '', pathMatch: "full", redirectTo: 'table'},
  {path: 'table', loadComponent: () => import('./components/table-view/table-view.component').then(m => m.TableViewComponent)}
];
