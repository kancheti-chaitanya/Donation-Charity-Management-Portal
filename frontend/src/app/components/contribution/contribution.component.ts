import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PickupService } from '../../services/pickup.service';

@Component({
  selector: 'app-contribution',
  templateUrl: './contribution.component.html',
  styleUrls: ['./contribution.component.scss'],
})
export class ContributionComponent implements OnInit {
  form: FormGroup;
  loading = false;
  submitting = false;
  donationId: number = 0;

  constructor(
    private pickupService: PickupService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.form = this.formBuilder.group({
      pickupDate: ['', Validators.required],
      pickupTime: ['', Validators.required],
      notes: [''],
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.donationId = parseInt(id, 10);
    }
  }

  get f() {
    return this.form.controls;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    this.submitting = true;
    const pickupData = {
      donationId: this.donationId,
      pickupDate: this.f['pickupDate'].value,
      pickupTime: this.f['pickupTime'].value,
      notes: this.f['notes'].value,
    };

    this.pickupService.schedulePickup(pickupData).subscribe({
      next: () => {
        alert('Pickup scheduled successfully!');
        this.router.navigate(['/donor/dashboard']);
      },
      error: (error) => {
        alert(error.error?.message || 'Failed to schedule pickup');
        this.submitting = false;
      },
    });
  }
}
