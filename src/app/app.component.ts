import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Donation & Charity Management Portal';
  currentUser: any;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  navigateToDashboard(): void {
    if (this.currentUser?.role === 'NGO') {
      this.router.navigate(['/ngo/dashboard']);
    } else if (this.currentUser?.role === 'Donor') {
      this.router.navigate(['/donor/dashboard']);
    }
  }
}
