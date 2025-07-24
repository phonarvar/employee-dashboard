import { Component, Input } from '@angular/core';
import { Employee } from '../employee.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: '[app-employee-item]',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './employee-item.component.html',
  styleUrls: ['./employee-item.component.scss'],
})
export class EmployeeItemComponent {
  @Input() employee!: Employee;
}
