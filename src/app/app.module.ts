import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import {RouterModule} from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { WorkoutComponent } from './workout/workout.component';
import { ReportsComponent } from './reports/reports.component';
import { UserReportComponent } from './reports/user-report/user-report.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FooterComponent } from './footer/footer.component';
import { ChartModule } from 'primeng/chart';
import { LocalStorageService } from './services/local-storage.service';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    WorkoutComponent,
    ReportsComponent,
    UserReportComponent,
    DashboardComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ChartModule,
    RouterModule
  ],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync(),
    LocalStorageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
