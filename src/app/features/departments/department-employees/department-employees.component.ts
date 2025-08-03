import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../../employees/employees.service';
import { DepartmentService } from '../../../core/department.service';
import { Employee } from '../../employees/employee.model';
import { Department } from '../../../core/model';
import { SpinnerComponent } from '../../../shared/spinner/spinner.component';

@Component({
  selector: 'app-department-employees',
  standalone: true,
  imports: [CommonModule, SpinnerComponent],
  templateUrl: './department-employees.component.html',
  styleUrls: ['./department-employees.component.scss'],
})
export class DepartmentEmployeesComponent implements OnInit {
  private employeeService = inject(EmployeeService);
  private departmentService = inject(DepartmentService); //no longer needed
  private route = inject(ActivatedRoute);
  private router = inject(Router); // no longer needed

  departmentId = '';
  departmentName = '';
  employees: Employee[] = [];
  loading = true;

  ngOnInit(): void {
    this.departmentName = this.route.snapshot.paramMap.get('name') || '';

    this.employeeService.getEmployees().subscribe((employees) => {
      this.employees = employees.filter(
        (e) => e.department.toLowerCase() === this.departmentName.toLowerCase()
      );
      this.loading = false;
    });
  }
}
