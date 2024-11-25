import {Routes} from '@angular/router';
import {HomeComponent} from "./core/layout/home/home.component";

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
      {path: 'dashboard', loadChildren: () => import('./modules/dashboard/dashboard.routes').then(m => m.routes)},
      {path: 'autor', loadChildren: () => import('./modules/autor/autor.routes').then(m => m.routes)},
      {path: 'libro', loadChildren: () => import('./modules/libro/libro.routes').then(m => m.routes)},
      {path: 'prestamo', loadChildren: () => import('./modules/prestamo/prestamo.routes').then(m => m.routes)},
    ],
  },
  {path: '**', redirectTo: ''}
];
