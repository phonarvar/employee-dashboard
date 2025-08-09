import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LeaveRequest } from './model';


@Injectable({ providedIn: 'root' })
export class LeaveRequestService {
  private http = inject(HttpClient);

  //new MockAPI endpoint for leave requests
  private apiUrl =
    'https://6882886f21fa24876a9b249c.mockapi.io/api/v1/leaverequests';

  getLeaves(): Observable<LeaveRequest[]> {
    return this.http.get<LeaveRequest[]>(this.apiUrl);
  }

  updateLeaveStatus(
    id: string,
    status: 'approved' | 'rejected'
  ): Observable<LeaveRequest> {
    return this.http.put<LeaveRequest>(`${this.apiUrl}/${id}`, { status });
  }

  createLeaveRequest(data: Omit<LeaveRequest, 'id'>): Observable<LeaveRequest> {
    return this.http.post<LeaveRequest>(this.apiUrl, data);
  }

  deleteLeave(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
