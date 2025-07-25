import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeaveRequestService } from '../../core/leave-request.service';
import { EmployeeService } from '../employees/employees.service';
import { LeaveRequest } from '../../core/model';
import { Employee } from '../employees/employee.model';

@Component({
  selector: 'app-leave-requests',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './leave-requests.component.html',
  styleUrls: ['./leave-requests.component.scss'],
})
export class LeaveRequestsComponent implements OnInit {
  private leaveService = inject(LeaveRequestService);
  private employeeService = inject(EmployeeService);

  leaveRequests: LeaveRequest[] = [];
  employeesMap = new Map<string, Employee>();

  ngOnInit(): void {
    // Fetch employees first to map by ID
    this.employeeService.getEmployees().subscribe((employees) => {
      for (const emp of employees) {
        this.employeesMap.set(emp.id, emp);
      }

      // Then fetch leave requests
      this.leaveService.getLeaves().subscribe((leaves) => {
        this.leaveRequests = leaves;
      });
    });
  }

  getEmployee(id: string): Employee | undefined {
    return this.employeesMap.get(id);
  }

  approve(leave: LeaveRequest) {
    this.leaveService.updateLeaveStatus(leave.id, 'approved').subscribe(() => {
      // Optional: set employee as inactive
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
}
