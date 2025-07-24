import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Department, LeaveRequest } from './model';

@Injectable({ providedIn: 'root' })
export class RealApiService {
  private http = inject(HttpClient);
  private apiUrl = 'https://mockapi.io/api/v1'; // TEMP placeholder — update later

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>('https://jsonplaceholder.typicode.com/users');
  }
  getDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(`${this.apiUrl}/departments`);
  }

  getLeaves(): Observable<LeaveRequest[]> {
    return this.http.get<LeaveRequest[]>(`${this.apiUrl}/leaves`);
  }
}
