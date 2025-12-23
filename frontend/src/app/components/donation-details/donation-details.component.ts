import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { DonationService } from '../../services/donation.service';
import { ContributionService } from '../../services/contribution.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-donation-details',
  templateUrl: './donation-details.component.html',
  styleUrls: ['./donation-details.component.scss'],
})
export class DonationDetailsComponent implements OnInit {
  donation: any;
  loading = false;
  currentUser: any;
  showContributeForm = false;
  contributionAmount = 0;
  contributionNotes = '';
  submitting = false;

  constructor(
    private donationService: DonationService,
    private contributionService: ContributionService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadDonation(parseInt(id, 10));
    }
  }

  goBack(): void {
    this.location.back();
  }

  loadDonation(id: number): void {
    this.loading = true;
    this.donationService.getDonationById(id).subscribe({
      next: (response) => {
        this.donation = response.donation;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading donation:', error);
        this.loading = false;
      },
    });
  }

  toggleContributeForm(): void {
    if (!this.currentUser || this.currentUser.role !== 'Donor') {
      this.router.navigate(['/login']);
      return;
    }
    this.showContributeForm = !this.showContributeForm;
  }

  submitContribution(): void {
    if (!this.contributionAmount || this.contributionAmount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    this.submitting = true;
    const contributionData = {
      donationId: this.donation.id,
      amount: this.contributionAmount,
      notes: this.contributionNotes,
    };

    this.contributionService.createContribution(contributionData).subscribe({
      next: () => {
        alert('Contribution successful! Proceeding to pickup scheduling...');
        this.router.navigate(['/donations', this.donation.id, 'contribute']);
      },
      error: (error) => {
        alert(error.error?.message || 'Contribution failed');
        this.submitting = false;
      },
    });
  }
}
