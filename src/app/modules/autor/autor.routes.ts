import {Routes} from "@angular/router";
import {AutorListComponent} from "./pages/autor-list/autor-list.component";
import {AutorFormComponent} from "./pages/autor-form/autor-form.component";

export const routes: Routes = [
  {path: '', redirectTo: 'list', pathMatch: 'full'},
  {path: 'list', component: AutorListComponent},
  {path: 'new', component: AutorFormComponent},
  {path: 'edit/:autorId', component: AutorFormComponent}
];
