import { Component, OnInit, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeaveRequestService } from '../../core/leave-request.service';
import { EmployeeService } from '../employees/employees.service';
import { LeaveRequest } from '../../core/model';
import { Employee } from '../employees/employee.model';
import { AuthService } from '../../core/auth-service.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-leave-requests',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './leave-requests.component.html',
  styleUrls: ['./leave-requests.component.scss'],
})
export class LeaveRequestsComponent implements OnInit {
  private leaveService = inject(LeaveRequestService);
  private employeeService = inject(EmployeeService);
  private authService = inject(AuthService);

  leaveRequests: LeaveRequest[] = [];
  employeesMap = new Map<string, Employee>(); // use a key that is string to store an object that is type of employee

  // Expose isAdmin as a public getter
  readonly isAdmin = this.authService.isAdmin();

  // Model for leave request form (if user)
  leave = {
    startDate: '',
    endDate: '',
    reason: '',
  };

  ngOnInit(): void {
    if (this.isAdmin) {
      // Only admins fetch employee list and leave requests
      // we can then retrieve employee object // Fetch employees first to map by ID
      //Given a leave.employeeId, find the matching employee object from the other API
      this.employeeService.getEmployees().subscribe((employees) => {
        for (const emp of employees) {
          this.employeesMap.set(emp.id, emp);
        }

        this.leaveService.getLeaves().subscribe((leaves) => {
          this.leaveRequests = leaves;
        });
      });
    }
  }

  getEmployee(id: string): Employee | undefined {
    return this.employeesMap.get(id);
  }

  approve(leave: LeaveRequest) {
    this.leaveService.updateLeaveStatus(leave.id, 'approved').subscribe(() => {
      const emp = this.getEmployee(leave.employeeId);
      if (emp && emp.status !== 'inactive') {
        this.employeeService.updateStatus(emp.id, 'inactive').subscribe(() => {
          leave.status = 'approved';
          emp.status = 'inactive';
        });
      } else {
        leave.status = 'approved';
      }
    });
  }

  reject(leave: LeaveRequest) {
    this.leaveService.updateLeaveStatus(leave.id, 'rejected').subscribe(() => {
      leave.status = 'rejected';
    });
  }

  submitLeaveRequest() {
    const employeeId = this.authService.loggedInUserId();

    const newLeave: Omit<LeaveRequest, 'id'> = {
      ...this.leave,
      employeeId,
      status: 'pending',
    };

    this.leaveService.createLeaveRequest(newLeave).subscribe(() => {
      alert('Leave request submitted!');
      this.leave = { startDate: '', endDate: '', reason: '' }; // Reset
    });
  }
}
