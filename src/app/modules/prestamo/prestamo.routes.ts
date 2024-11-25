import {Routes} from "@angular/router";
import {PrestamoFormComponent} from "./pages/prestamo-form/prestamo-form.component";
import {PrestamoListComponent} from "./pages/prestamo-list/prestamo-list.component";

export const routes: Routes = [
  {path: '', redirectTo: 'list', pathMatch: 'full'},
  {path: 'list', component: PrestamoListComponent},
  {path: 'new', component: PrestamoFormComponent},
  {path: 'edit/:prestamoId', component: PrestamoFormComponent}
];
