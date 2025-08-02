import { Component, Input } from '@angular/core';
import { Employee } from '../employee.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: '[app-employee-item]', //the component is applied as an attribute, not as a custom element.

  standalone: true,
  imports: [CommonModule],
  templateUrl: './employee-item.component.html',
  styleUrls: ['./employee-item.component.scss'],
})
export class EmployeeItemComponent {
  @Input() employee!: Employee;

  ngOnInit() {
    if (!this.employee) {
      //td's were not rendering because if one employee object was not valid, angular would
      //still pass it to child comp (case in point, employee-item)
      //then if angular saw something it couldn't handle, it would silently drop the entire row
      //this would mess up template without throwing error
      //needless to say I got very confused and asked chatgpt then adjusted both template and
      //backend objects
      //Angular requires all component templates to have a single root node
      //so added container for that and to ensure employee exists
      console.warn('Employee input is missing or undefined');
    }
  }
}
