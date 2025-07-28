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
  employeesMap = new Map<string, Employee>();

  readonly isAdmin = computed(() => this.authService.isAdmin()); //signal, not static boolean

  // Form Model for User submission
  startDate: string = '';
  endDate: string = '';
  reason: string = '';

  ngOnInit(): void {
    if (this.isAdmin()) {
      // Admin: load all leave requests + employee names
      this.employeeService.getEmployees().subscribe((employees) => {
        for (const emp of employees) {
          this.employeesMap.set(emp.id, emp);
        }

        this.leaveService.getLeaves().subscribe((leaves) => {
          this.leaveRequests = leaves;
        });
      });
    } else {
      // User view: optional logic to fetch their own requests
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

  submitForm() {
    const employeeId = this.authService.loggedInUserId() ?? '';

    if (!this.startDate || !this.endDate || !this.reason) {
      alert('Please fill in all fields.');
      return;
    }

    const newLeave: Omit<LeaveRequest, 'id'> = {
      startDate: this.startDate,
      endDate: this.endDate,
      reason: this.reason,
      employeeId,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    this.leaveService.createLeaveRequest(newLeave).subscribe(() => {
      alert('Leave request submitted!');
      this.startDate = '';
      this.endDate = '';
      this.reason = '';
    });
  }
}
