import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../../employees/employees.service';
import { DepartmentService } from '../../../core/department.service';
import { Employee } from '../../employees/employee.model';
import { Department } from '../../../core/model';

@Component({
  selector: 'app-department-employees',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './department-employees.component.html',
  styleUrls: ['./department-employees.component.scss'],
})
export class DepartmentEmployeesComponent implements OnInit {
  private employeeService = inject(EmployeeService);
  private departmentService = inject(DepartmentService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  departmentId = '';
  departmentName = '';
  employees: Employee[] = [];

  ngOnInit(): void {
    this.departmentId = this.route.snapshot.paramMap.get('id') || '';

    this.departmentService.getDepartments().subscribe((departments) => {
      const dept = departments.find((d) => d.id === this.departmentId);
      if (dept) {
        this.departmentName = dept.name;

        this.employeeService.getEmployees().subscribe((employees) => {
          this.employees = employees.filter((e) => e.department === dept.name);
        });
      } else {
        alert('Department not found');
        this.router.navigate(['/departments']);
      }
    });
  }
}
