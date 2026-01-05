import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DonationListComponent } from './components/donation-list/donation-list.component';
import { DonationDetailsComponent } from './components/donation-details/donation-details.component';
import { ContributionComponent } from './components/contribution/contribution.component';
import { NGODashboardComponent } from './components/ngo-dashboard/ngo-dashboard.component';
import { DonorDashboardComponent } from './components/donor-dashboard/donor-dashboard.component';
import { LeaderboardComponent } from './components/leaderboard/leaderboard.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { NotAuthorizedComponent } from './components/not-authorized/not-authorized.component';
import { HomeComponent } from './components/home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    DonationListComponent,
    DonationDetailsComponent,
    ContributionComponent,
    NGODashboardComponent,
    DonorDashboardComponent,
    LeaderboardComponent,
    NotAuthorizedComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    MatToolbarModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatTabsModule,
    MatMenuModule,
    MatTooltipModule,
    MatDividerModule,
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
  bootstrap: [AppComponent],
})
export class AppModule {}