import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DonationService {
  private apiUrl = 'http://localhost:3000/api/donations';

  constructor(private http: HttpClient) {}

  createDonation(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  getDonations(filters?: any): Observable<any> {
    let url = this.apiUrl;
    if (filters) {
      const params = new URLSearchParams();
      if (filters.type) params.append('type', filters.type);
      if (filters.location) params.append('location', filters.location);
      if (filters.status) params.append('status', filters.status);
      if (params.toString()) url += '?' + params.toString();
    }
    return this.http.get(url);
  }

  getDonationById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  updateDonation(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  deleteDonation(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getNGODonations(): Observable<any> {
    return this.http.get(`${this.apiUrl}/my-donations`);
  }
}
