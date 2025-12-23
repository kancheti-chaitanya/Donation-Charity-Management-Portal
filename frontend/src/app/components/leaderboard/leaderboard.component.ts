import { Component, OnInit } from '@angular/core';
import { LeaderboardService } from '../../services/leaderboard.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss'],
})
export class LeaderboardComponent implements OnInit {
  leaderboard: any[] = [];
  userStats: any = null;
  loading = false;
  currentUser: any;

  constructor(
    private leaderboardService: LeaderboardService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadLeaderboard();
    if (this.currentUser?.role === 'Donor') {
      this.loadUserStats();
    }
  }

  loadLeaderboard(): void {
    this.loading = true;
    this.leaderboardService.getLeaderboard().subscribe({
      next: (response) => {
        this.leaderboard = response.leaderboard || [];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading leaderboard:', error);
        this.loading = false;
      },
    });
  }

  loadUserStats(): void {
    this.leaderboardService.getDonorStats().subscribe({
      next: (response) => {
        this.userStats = response.stats;
      },
      error: (error) => {
        console.error('Error loading user stats:', error);
      },
    });
  }
}
