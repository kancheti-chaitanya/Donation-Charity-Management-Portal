import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContributionService {
  private apiUrl = 'http://localhost:3000/api/contributions';

  constructor(private http: HttpClient) {}

  createContribution(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  getContributions(filters?: any): Observable<any> {
    let url = this.apiUrl;
    if (filters) {
      const params = new URLSearchParams();
      if (filters.donationId) params.append('donationId', filters.donationId);
      if (filters.donorId) params.append('donorId', filters.donorId);
      if (params.toString()) url += '?' + params.toString();
    }
    return this.http.get(url);
  }

  getDonorContributions(): Observable<any> {
    return this.http.get(`${this.apiUrl}/my-contributions`);
  }
}
