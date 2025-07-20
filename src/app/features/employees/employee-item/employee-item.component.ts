import { Component, Input } from '@angular/core';
import { Employee } from '../employee.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'tr[app-employee-item]', //changed selector because it needs to target tr instead of entire tbody
  standalone: true,
  imports: [CommonModule],
  templateUrl: './employee-item.component.html',
  styleUrl: './employee-item.component.scss',
})
export class EmployeeItemComponent {
  @Input() employee!: Employee;
}
