import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { WorkoutComponent } from './workout/workout.component';
import { ReportsComponent } from './reports/reports.component';
import { UserReportComponent } from './reports/user-report/user-report.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'workout', component: WorkoutComponent },
  { path: 'reports', component: ReportsComponent },
  { path: 'reports/:username', component: UserReportComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
