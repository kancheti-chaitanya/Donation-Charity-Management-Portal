import { Component, OnInit } from '@angular/core';
import { DonationService } from '../../services/donation.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-donation-list',
  templateUrl: './donation-list.component.html',
  styleUrls: ['./donation-list.component.scss'],
})
export class DonationListComponent implements OnInit {
  donations: any[] = [];
  filteredDonations: any[] = [];
  loading = false;
  selectedType = '';
  selectedLocation = '';
  types = ['Food', 'Clothes', 'Books', 'Medical Supplies', 'Other'];

  constructor(
    private donationService: DonationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDonations();
  }

  loadDonations(): void {
    this.loading = true;
    this.donationService.getDonations().subscribe({
      next: (response) => {
        this.donations = response.donations || [];
        this.filteredDonations = this.donations;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading donations:', error);
        this.loading = false;
      },
    });
  }

  applyFilters(): void {
    this.filteredDonations = this.donations.filter((donation) => {
      const typeMatch = !this.selectedType || donation.donation_type === this.selectedType;
      const locationMatch = !this.selectedLocation || donation.location.toLowerCase().includes(this.selectedLocation.toLowerCase());
      return typeMatch && locationMatch;
    });
  }

  viewDetails(id: number): void {
    this.router.navigate(['/donations', id]);
  }
}
