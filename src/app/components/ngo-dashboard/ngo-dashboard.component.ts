import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DonationService } from '../../services/donation.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-ngo-dashboard',
  templateUrl: './ngo-dashboard.component.html',
  styleUrls: ['./ngo-dashboard.component.scss'],
})
export class NGODashboardComponent implements OnInit {
  donations: any[] = [];
  form: FormGroup;
  showCreateForm = false;
  loading = false;
  submitting = false;
  currentUser: any;
  types = ['Food', 'Clothes', 'Books', 'Medical Supplies', 'Other'];

  constructor(
    private donationService: DonationService,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
    this.form = this.formBuilder.group({
      donationType: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(1)]],
      location: ['', Validators.required],
      pickupDateTime: ['', Validators.required],
      images: [''],
      priority: ['Normal'],
    });
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadNGODonations();
  }

  loadNGODonations(): void {
    this.loading = true;
    this.donationService.getNGODonations().subscribe({
      next: (response) => {
        this.donations = response.donations || [];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading donations:', error);
        this.loading = false;
      },
    });
  }

  get f() {
    return this.form.controls;
  }

  toggleCreateForm(): void {
    this.showCreateForm = !this.showCreateForm;
    if (!this.showCreateForm) {
      this.form.reset();
    }
  }

  onCreateSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    this.submitting = true;
    this.donationService.createDonation(this.form.value).subscribe({
      next: () => {
        alert('Donation request created successfully!');
        this.form.reset();
        this.showCreateForm = false;
        this.loadNGODonations();
      },
      error: (error) => {
        alert(error.error?.message || 'Failed to create donation');
        this.submitting = false;
      },
    });
  }

  editDonation(donation: any): void {
    this.form.patchValue({
      donationType: donation.donation_type,
      quantity: donation.quantity_or_amount,
      location: donation.location,
      pickupDateTime: donation.pickup_date_time,
      priority: donation.priority,
    });
    this.showCreateForm = true;
  }

  deleteDonation(id: number): void {
    if (confirm('Are you sure you want to cancel this donation request?')) {
      this.donationService.deleteDonation(id).subscribe({
        next: () => {
          alert('Donation cancelled successfully');
          this.loadNGODonations();
        },
        error: (error) => {
          alert(error.error?.message || 'Failed to cancel donation');
        },
      });
    }
  }
}
