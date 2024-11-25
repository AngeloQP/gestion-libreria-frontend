import {Routes} from "@angular/router";
import {LibroListComponent} from "./pages/libro-list/libro-list.component";
import {LibroFormComponent} from "./pages/libro-form/libro-form.component";

export const routes: Routes = [
  {path: '', redirectTo: 'list', pathMatch: 'full'},
  {path: 'list', component: LibroListComponent},
  {path: 'new', component: LibroFormComponent},
  {path: 'edit/:libroId', component: LibroFormComponent}
];
