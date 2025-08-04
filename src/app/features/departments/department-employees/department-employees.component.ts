import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../../employees/employees.service';
import { DepartmentService } from '../../../core/department.service';
import { Employee } from '../../employees/employee.model';
import { Department } from '../../../core/model';
import { SpinnerComponent } from '../../../shared/spinner/spinner.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-department-employees',
  standalone: true,
  imports: [CommonModule, SpinnerComponent, FormsModule],
  templateUrl: './department-employees.component.html',
  styleUrls: ['./department-employees.component.scss'],
})
export class DepartmentEmployeesComponent implements OnInit {
  private employeeService = inject(EmployeeService);
  private departmentService = inject(DepartmentService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  departmentName = '';
  employees: Employee[] = [];
  loading = true;

  editedPositions: { [id: string]: string } = {}; // Tracks each employee's edited position
  editedStatuses: { [id: string]: string } = {}; // Tracks each employee's edited status
  editing: { [id: string]: boolean } = {}; // Tracks which rows are in "editing" mode
  feedback: { [id: string]: string } = {}; // Stores "Saved!" or "Error" messages

  readonly validPositions = [
    // valid positions
    'Head of Engineering',
    'Head of Design',
    'Head of Product',
    'Head of Human Resources',
    'Head of Marketing',
    'Software Engineer',
    'Product Manager',
    'UI/UX Designer',
    'HR Coordinator',
    'Marketing Specialist',
    'QA Analyst',
    'Frontend Developer',
    'Recruiter',
    'Brand Manager',
    'Backend Developer',
  ];

  ngOnInit(): void {
    this.departmentName = this.route.snapshot.paramMap.get('name') || '';

    this.employeeService.getEmployees().subscribe((employees) => {
      this.employees = employees.filter(
        (e) => e.department.toLowerCase() === this.departmentName.toLowerCase()
      );

      // Initialize edit states for each employee
      this.employees.forEach((emp) => {
        this.editedPositions[emp.id] = emp.position;
        this.editedStatuses[emp.id] = emp.status;
        this.editing[emp.id] = false;
        this.feedback[emp.id] = '';
      });

      this.loading = false;
    });
  }

  startEdit(id: string) {
    this.editing[id] = true;
    this.feedback[id] = '';
  }

  cancelEdit(id: string) {
    const original = this.employees.find((e) => e.id === id);
    if (original) {
      this.editedPositions[id] = original.position;
      this.editedStatuses[id] = original.status;
    }
    this.editing[id] = false;
    this.feedback[id] = '';
  }

  saveChanges(id: string) {
    const newPosition = this.editedPositions[id]; //id being variable that holds keys like '1', '2', etc.
    const newStatus = this.editedStatuses[id];

    this.employeeService
      .updateEmployee(id, { position: newPosition, status: newStatus })
      .subscribe({
        next: () => {
          this.feedback[id] = '✅ Saved!';
          this.editing[id] = false;

          const emp = this.employees.find((e) => e.id === id);
          if (emp) {
            emp.position = newPosition;
            emp.status = newStatus;
          }
        },
        error: () => {
          this.feedback[id] = '❌ Error saving!';
        },
      });
  }
}
