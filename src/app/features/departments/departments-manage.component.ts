import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';

import { DepartmentService } from '../../core/department.service';
import { EmployeeService } from '../employees/employees.service';
import { Department } from '../../core/model';
import { Employee } from '../employees/employee.model';
import { SpinnerComponent } from '../../shared/spinner/spinner.component';
import { IfUserIsAdminDirective } from '../../shared/directives/if-user-is-admin.directive';

@Component({
  selector: 'app-departments-manage',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    SpinnerComponent,
    IfUserIsAdminDirective,
  ],
  templateUrl: './departments-manage.component.html',
  styleUrls: ['./departments-manage.component.scss'],
})
export class DepartmentsManageComponent implements OnInit {
  private deptService = inject(DepartmentService);
  private empService = inject(EmployeeService);

  // global loading while initial load or batch operations
  loading = true;

  // data
  departments: Department[] = [];
  employees: Employee[] = [];

  //
  // Create department UI state
  //
  showCreateDept = false;
  newDeptName = '';
  createLoading = false;

  //
  // Transfer UI state
  //
  sourceDeptId = '';             // selected source department id
  membersForSource: Employee[] = []; // employees that belong to source (populated after source selection)
  selectedMemberIds: string[] = [];  // selected members (multi-select)
  targetDeptId = '';             // selected target department id
  transferLoading = false;

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
        this.departments = departments;
        this.employees = employees;
        // If source dept already selected, refresh members list
        if (this.sourceDeptId) {
          this.onSourceDeptChange();
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading data:', err);
        this.loading = false;
      },
    });
  }

  // Toggle the inline "create department" UI
  toggleCreateDept(): void {
    this.showCreateDept = !this.showCreateDept;
    if (!this.showCreateDept) {
      this.newDeptName = '';
      this.createLoading = false;
    }
  }

  // Create a new department (inline form)
  createDepartmentInline(): void {
    const name = this.newDeptName?.trim();
    if (!name) return;

    const newDept: Department = {
      id: '',
      name,
      head: 'Unknown',
      employeeCount: 0,
    };

    this.createLoading = true;
    this.deptService.addDepartment(newDept).subscribe({
      next: (dept) => {
        // Add to local list so dropdowns update immediately
        this.departments = [...this.departments, dept];
        this.createLoading = false;
        this.newDeptName = '';
        this.showCreateDept = false;
      },
      error: (err) => {
        console.error('Error creating department:', err);
        this.createLoading = false;
      },
    });
  }

  // When source department changes: update the members list and clear previous selections
  onSourceDeptChange(): void {
    this.selectedMemberIds = [];
    this.membersForSource = [];

    if (!this.sourceDeptId) return;

    const sourceName = this.getDepartmentNameById(this.sourceDeptId);
    if (!sourceName) return;

    // employees store department as name string in model
    this.membersForSource = this.employees.filter(e => e.department === sourceName);
  }

  // Save transfer: update each selected employee's department to the target department name
  saveTransfer(): void {
    if (!this.sourceDeptId || !this.targetDeptId || this.selectedMemberIds.length === 0) {
      return;
    }

    if (this.sourceDeptId === this.targetDeptId) {
      // prevent no-op transfers
      alert('Please choose a different target department than the source.');
      return;
    }

    const targetName = this.getDepartmentNameById(this.targetDeptId);
    if (!targetName) return;

    const updateRequests: Observable<any>[] = this.selectedMemberIds
      .map(empId => {
        const emp = this.employees.find(e => e.id === empId);
        if (!emp) return null;
        const updated: Employee = { ...emp, department: targetName };
        return this.empService.updateEmployee(empId, updated);
      })
      .filter((r): r is Observable<any> => r !== null);

    if (updateRequests.length === 0) return;

    this.transferLoading = true;
    forkJoin(updateRequests).subscribe({
      next: () => {
        // reset transfer form and reload fresh data
        this.sourceDeptId = '';
        this.targetDeptId = '';
        this.selectedMemberIds = [];
        this.membersForSource = [];
        this.transferLoading = false;
        this.loadData();
      },
      error: (err) => {
        console.error('Error transferring employees:', err);
        this.transferLoading = false;
      }
    });
  }

  private getDepartmentNameById(id: string): string {
    return this.departments.find(d => d.id === id)?.name || '';
  }
}
