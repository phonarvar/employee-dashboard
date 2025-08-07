import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DepartmentService } from '../../core/department.service';
import { EmployeeService } from '../employees/employees.service';
import { Department } from '../../core/model';
import { Employee } from '../employees/employee.model';
import { forkJoin, Observable } from 'rxjs';

@Component({
  selector: 'app-departments-manage',
  standalone: true,
  imports: [CommonModule, FormsModule], // minimal imports to avoid cross-compiled library issues
  templateUrl: './departments-manage.component.html',
  styleUrls: ['./departments-manage.component.scss'],
})
export class DepartmentsManageComponent implements OnInit {
  private deptService = inject(DepartmentService);
  private empService = inject(EmployeeService);

  loading = true;
  departments: Department[] = [];
  employees: Employee[] = [];

  newDepartmentName = '';
  selectedDepartmentId = '';
  selectedEmployeeIds: string[] = [];

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    forkJoin({
      departments: this.deptService.getDepartments(),
      employees: this.empService.getEmployees(),
    }).subscribe({
      next: ({ departments, employees }) => {
        this.departments = departments ?? [];
        this.employees = employees ?? [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Load data error', err);
        this.loading = false;
      },
    });
  }

  toggleEmployeeSelection(empId: string, checked: boolean): void {
    if (checked) {
      if (!this.selectedEmployeeIds.includes(empId)) {
        this.selectedEmployeeIds.push(empId);
      }
    } else {
      this.selectedEmployeeIds = this.selectedEmployeeIds.filter((id) => id !== empId);
    }
  }

  createDepartmentAndTransfer(): void {
    // require either new department name or selected existing dept, plus at least one employee
    if (this.selectedEmployeeIds.length === 0) return;
    if (!this.newDepartmentName?.trim() && !this.selectedDepartmentId) return;

    this.loading = true;

    if (this.newDepartmentName?.trim()) {
      const newDept: Department = {
        id: '', // MockAPI will assign id
        name: this.newDepartmentName.trim(),
        head: 'Unknown',
        employeeCount: 0,
      };

      this.deptService.addDepartment(newDept).subscribe({
        next: (created) => {
          const deptName = created.name;
          this.selectedDepartmentId = created.id;
          this.transferEmployeesToDeptName(deptName);
        },
        error: (err) => {
          console.error('Error creating department:', err);
          this.loading = false;
        },
      });
    } else {
      const deptName = this.getDepartmentNameById(this.selectedDepartmentId);
      this.transferEmployeesToDeptName(deptName);
    }
  }

  private transferEmployeesToDeptName(deptName: string): void {
    const reqs: Observable<any>[] = this.selectedEmployeeIds
      .map((empId) => {
        const emp = this.employees.find((e) => e.id === empId);
        if (!emp) return null;
        const updated: Partial<Employee> = { ...emp, department: deptName };
        return this.empService.updateEmployee(empId, updated);
      })
      .filter((r): r is Observable<any> => r !== null);

    if (reqs.length === 0) {
      this.loading = false;
      return;
    }

    forkJoin(reqs).subscribe({
      next: () => {
        this.newDepartmentName = '';
        this.selectedDepartmentId = '';
        this.selectedEmployeeIds = [];
        this.loadData();
      },
      error: (err) => {
        console.error('Error updating employees:', err);
        this.loading = false;
      },
    });
  }

  getDepartmentNameById(id: string): string {
    return this.departments.find((d) => d.id === id)?.name ?? '';
  }
}
