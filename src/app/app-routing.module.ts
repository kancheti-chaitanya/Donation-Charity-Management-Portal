import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { DonationListComponent } from './components/donation-list/donation-list.component';
import { DonationDetailsComponent } from './components/donation-details/donation-details.component';
import { ContributionComponent } from './components/contribution/contribution.component';
import { NGODashboardComponent } from './components/ngo-dashboard/ngo-dashboard.component';
import { DonorDashboardComponent } from './components/donor-dashboard/donor-dashboard.component';
import { LeaderboardComponent } from './components/leaderboard/leaderboard.component';
import { NotAuthorizedComponent } from './components/not-authorized/not-authorized.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'donations', component: DonationListComponent },
  { path: 'donations/:id', component: DonationDetailsComponent },
  {
    path: 'donations/:id/contribute',
    component: ContributionComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Donor'] },
  },
  {
    path: 'ngo/dashboard',
    component: NGODashboardComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['NGO'] },
  },
  {
    path: 'donor/dashboard',
    component: DonorDashboardComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Donor'] },
  },
  { path: 'leaderboard', component: LeaderboardComponent },
  { path: 'not-authorized', component: NotAuthorizedComponent },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
