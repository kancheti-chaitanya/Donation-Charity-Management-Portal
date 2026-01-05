import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LeaderboardService {
  private apiUrl = 'http://localhost:3000/api/leaderboard';

  constructor(private http: HttpClient) {}

  getLeaderboard(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getDonorStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/stats`);
  }
}
