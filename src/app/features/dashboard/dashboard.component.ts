import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../employees/employees.service';
import { DepartmentService } from '../../core/department.service';
import { LeaveRequestService } from '../../core/leave-request.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  private employeeService = inject(EmployeeService);
  private departmentService = inject(DepartmentService);
  private leaveService = inject(LeaveRequestService);

  totalEmployees = 0;
  totalDepartments = 0;
  pendingLeaves = 0;

  ngOnInit(): void {
    this.employeeService.getEmployees().subscribe((data) => {
      this.totalEmployees = data.length;
    });

    this.departmentService.getDepartments().subscribe((data) => {
      this.totalDepartments = data.length;
    });

    this.leaveService.getLeaves().subscribe((data) => {
      this.pendingLeaves = data.filter((l) => l.status === 'pending').length;
    });
  }
}
