import { Component, OnInit } from '@angular/core';
import { ContributionService } from '../../services/contribution.service';
import { PickupService } from '../../services/pickup.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-donor-dashboard',
  templateUrl: './donor-dashboard.component.html',
  styleUrls: ['./donor-dashboard.component.scss'],
})
export class DonorDashboardComponent implements OnInit {
  contributions: any[] = [];
  pickups: any[] = [];
  loading = false;
  currentUser: any;
  activeTab = 'contributions';

  constructor(
    private contributionService: ContributionService,
    private pickupService: PickupService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadContributions();
    this.loadPickups();
  }

  loadContributions(): void {
    this.loading = true;
    this.contributionService.getDonorContributions().subscribe({
      next: (response) => {
        this.contributions = response.contributions || [];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading contributions:', error);
        this.loading = false;
      },
    });
  }

  loadPickups(): void {
    this.pickupService.getDonorPickups().subscribe({
      next: (response) => {
        this.pickups = response.pickups || [];
      },
      error: (error) => {
        console.error('Error loading pickups:', error);
      },
    });
  }

  switchTab(tab: string): void {
    this.activeTab = tab;
  }
}
