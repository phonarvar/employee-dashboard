import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LeaveRequestService } from '../../../core/leave-request.service';
import { AuthService } from '../../../core/auth-service.service';
import { LeaveRequest } from '../../../core/model';

@Component({
  selector: 'app-leave-request-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './leave-request-form.component.html',
  styleUrls: ['./leave-request-form.component.scss'],
})
export class LeaveRequestFormComponent {
  private leaveService = inject(LeaveRequestService);
  private authService = inject(AuthService);
  private router = inject(Router);

  // Form model for ngModel binding
  leave = {
    startDate: '',
    endDate: '',
    reason: '',
  };

  submitLeaveRequest() {
    const employeeId = this.authService.loggedInUserId();

    //  typed object to satisfy LeaveRequest type
    const newLeave: Omit<LeaveRequest, 'id'> = {
      ...this.leave,
      employeeId,
      status: 'pending',
    };

    this.leaveService.createLeaveRequest(newLeave).subscribe(() => {
      alert('Leave request submitted!');
      this.router.navigate(['/leave-requests']);
    });
  }
}
