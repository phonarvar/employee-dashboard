import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Department } from '../../core/model';
import { DepartmentService } from '../../core/department.service';
import { FormsModule } from '@angular/forms';
import { IfUserIsAdminDirective } from '../../shared/directives/if-user-is-admin.directive';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-departments',
  standalone: true,
  imports: [CommonModule, FormsModule, IfUserIsAdminDirective, RouterModule],
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.scss'],
})
export class DepartmentsComponent implements OnInit {
  private departmentService = inject(DepartmentService);
  private router = inject(Router);

  departments: Department[] = [];

  newDept: Partial<Department> = {
    name: '',
    head: '',
    employeeCount: 0,
  };

  ngOnInit(): void {
    this.loadDepartments();
  }

  loadDepartments() {
    this.departmentService.getDepartments().subscribe((data) => {
      this.departments = data;
    });
  }

  addDepartment() {
    this.departmentService
      .addDepartment(this.newDept as Department)
      .subscribe(() => {
        this.newDept = { name: '', head: '', employeeCount: 0 };
        this.loadDepartments();
      });
  }

  deleteDepartment(id: string) {
    if (confirm('Delete this department?')) {
      this.departmentService.deleteDepartment(id).subscribe(() => {
        this.loadDepartments();
      });
    }
  }

  viewEmployees(deptId: string) {
    this.router.navigate(['/departments', deptId, 'employees']);
  }
}
