import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../employees/employees.service';
import { RealApiService } from '../../core/real-api.service'; // simulate leaves & departments

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  private employeeService = inject(EmployeeService);
  private realApiService = inject(RealApiService); // fake leaves & departments

  totalEmployees = 0;
  totalDepartments = 0;
  pendingLeaves = 0;

  ngOnInit(): void {
    this.employeeService.getEmployees().subscribe((data) => {
      this.totalEmployees = data.length;
    });

    this.realApiService.getDepartments().subscribe((data) => {
      this.totalDepartments = data.length;
    });

    this.realApiService.getLeaves().subscribe((data) => {
      this.pendingLeaves = data.filter((l) => l.status === 'pending').length;
    });
  }
}
