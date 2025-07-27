import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/auth-service.service';
import { LeaveRequestService } from '../../../core/leave-request.service';
import { LeaveRequest } from '../../../core/model'; // <-- Make sure to import this

@Component({
  selector: 'app-leave-request-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './leave-request-form.component.html',
  styleUrls: ['./leave-request-form.component.scss'],
})
export class LeaveRequestFormComponent {
  startDate = '';
  endDate = '';
  reason = '';

  private authService = inject(AuthService);
  private leaveService = inject(LeaveRequestService);

  @Output() requestSubmitted = new EventEmitter<void>();

  submitForm() {
    const employeeId = this.authService.loggedInUserId();

    if (!employeeId) {
      alert('User is not logged in!');
      return;
    }

    const newLeave: Omit<LeaveRequest, 'id'> = {
      startDate: this.startDate,
      endDate: this.endDate,
      reason: this.reason,
      employeeId: employeeId,
      status: 'pending',
    };

    this.leaveService.createLeaveRequest(newLeave).subscribe(() => {
      alert('Leave request submitted!');
      this.startDate = '';
      this.endDate = '';
      this.reason = '';
      this.requestSubmitted.emit();
    });
  }
}
