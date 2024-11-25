import {Routes} from "@angular/router";
import {DashboardHomeComponent} from "./pages/dashboard-home/dashboard-home.component";

export const routes: Routes = [
  {path: '', redirectTo: '', pathMatch: 'full'},
  {path: '', component: DashboardHomeComponent}
]
