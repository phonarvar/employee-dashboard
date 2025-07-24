import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeaveRequestService } from '../../core/leave-request.service';
import { LeaveRequest } from '../../core/model';

@Component({
  selector: 'app-leave-requests',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './leave-requests.component.html',
  styleUrls: ['./leave-requests.component.scss'],
})
export class LeaveRequestsComponent implements OnInit {
  private leaveService = inject(LeaveRequestService);

  leaveRequests: LeaveRequest[] = [];

  ngOnInit(): void {
    this.leaveService.getLeaves().subscribe((data) => {
      this.leaveRequests = data;
    });
  }

  updateStatus(id: string, status: 'approved' | 'rejected') {
    this.leaveService.updateLeaveStatus(id, status).subscribe(() => {
      const request = this.leaveRequests.find((r) => r.id === id);
      if (request) {
        request.status = status;
      }
    });
  }
}
