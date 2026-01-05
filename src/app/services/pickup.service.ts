import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PickupService {
  private apiUrl = 'http://localhost:3000/api/pickups';

  constructor(private http: HttpClient) {}

  schedulePickup(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  getPickups(filters?: any): Observable<any> {
    let url = this.apiUrl;
    if (filters) {
      const params = new URLSearchParams();
      if (filters.donationId) params.append('donationId', filters.donationId);
      if (filters.status) params.append('status', filters.status);
      if (params.toString()) url += '?' + params.toString();
    }
    return this.http.get(url);
  }

  updatePickupStatus(id: number, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, { status });
  }

  getNGOPickups(): Observable<any> {
    return this.http.get(`${this.apiUrl}/ngo/schedule`);
  }

  getDonorPickups(): Observable<any> {
    return this.http.get(`${this.apiUrl}/donor/schedule`);
  }
}
