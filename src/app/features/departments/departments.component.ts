import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Department } from '../../core/model';
import { DepartmentService } from '../../core/department.service';
import { EmployeeService } from '../employees/employees.service';
import { Employee } from '../employees/employee.model';
import { FormsModule } from '@angular/forms';
import { IfUserIsAdminDirective } from '../../shared/directives/if-user-is-admin.directive';
import { Router, RouterModule } from '@angular/router';
import { SpinnerComponent } from '../../shared/spinner/spinner.component';

@Component({
  selector: 'app-departments',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IfUserIsAdminDirective,
    RouterModule,
    SpinnerComponent,
  ],
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.scss'],
})
export class DepartmentsComponent implements OnInit {
  private departmentService = inject(DepartmentService);
  private employeeService = inject(EmployeeService);
  private router = inject(Router);

  departments: Department[] = [];
  employees: Employee[] = [];
  loading = true;

  newDept: Partial<Department> = {
    name: '',
    head: '',
    employeeCount: 0,
  };

  ngOnInit(): void {
    this.loadData(); // CHANGED from loadDepartments()
  }

  loadData() {
    this.loading = true;
    this.departmentService.getDepartments().subscribe((depts) => {
      this.employeeService.getEmployees().subscribe((emps) => {
        this.employees = emps;

        this.departments = depts.map((dept) => {
          const headPosition = `Head of ${dept.name}`;
          const headEmployee = emps.find(
            (emp) =>
              emp.position === headPosition && emp.department === dept.name
          );

          const count = emps.filter(
            (emp) => emp.department === dept.name
          ).length;

          return {
            ...dept,
            head: headEmployee ? headEmployee.name : 'Unknown', // REPLACED hardcoded head
            employeeCount: count, //  CALCULATED instead of using backend value
          };
        });
        this.loading = false; // Set loading to false after data is loaded
      });
    });
  }

  addDepartment() {
    this.departmentService
      .addDepartment(this.newDept as Department)
      .subscribe(() => {
        this.newDept = { name: '', head: '', employeeCount: 0 };
        this.loadData(); //  CHANGED
      });
  }

  deleteDepartment(id: string) {
    if (confirm('Delete this department?')) {
      this.departmentService.deleteDepartment(id).subscribe(() => {
        this.loadData(); // CHANGED
      });
    }
  }

  viewEmployees(deptName: string) {
    this.router.navigate(['/departments', deptName]);
  }

  // Navigate to new page for creating department & transferring employees
  goToManagePage() {
    this.router.navigate(['/departments/manage']);
  }
}
