import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LeaveRequest } from './model';

@Injectable({ providedIn: 'root' })
export class LeaveRequestService {
  private http = inject(HttpClient);
  private apiUrl =
    'https://6882886f21fa24876a9b249c.mockapi.io/api/v1/leaverequests';

  getLeaves(): Observable<LeaveRequest[]> {
    return this.http.get<LeaveRequest[]>(this.apiUrl);
  }

  updateLeaveStatus(id: string, status: 'approved' | 'rejected') {
    return this.http.put<LeaveRequest>(`${this.apiUrl}/${id}`, {
      status,
    });
  }
}
