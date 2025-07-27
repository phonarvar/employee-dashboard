import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Department, LeaveRequest } from './model';

@Injectable({ providedIn: 'root' }) //this service was used to showcase backend api calls but it's not used other than it's status method
export class RealApiService {
  //this was previously made for experimental api calls
  private http = inject(HttpClient);
  private apiUrl = 'https://mockapi.io/api/v1';

  getUsers(): Observable<any[]> {
    // I have to look up getUsers to see where it's being used later, its url is old mock data, potential conflict
    return this.http.get<any[]>('https://jsonplaceholder.typicode.com/users');
  }
  getDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(`${this.apiUrl}/departments`);
  }

  getLeaves(): Observable<LeaveRequest[]> {
    return this.http.get<LeaveRequest[]>(`${this.apiUrl}/leaves`);
  }
  updateLeaveStatus(id: string, status: 'approved' | 'rejected') {
    return this.http.put<LeaveRequest>(`${this.apiUrl}/leaves/${id}`, {
      status,
    });
  }
}
