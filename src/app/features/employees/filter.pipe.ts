import { Pipe, PipeTransform } from '@angular/core';
import { Employee } from './employee.model';

@Pipe({
  name: 'filter',
  standalone: true,
})
export class FilterPipe implements PipeTransform {
  transform(employee: Employee[], searchTerm: string): Employee[] {
    if (!searchTerm) {
      //if searchTerm is falsy or empty returns full list
      return employee;
    }
    const term = searchTerm.toLowerCase();
    return employee.filter((emp) => {
      return (
        // forgot to return these matching terms first time
        //return object based on term matching name or department
        emp.name.toLowerCase().includes(term) ||
        emp.department.toLowerCase().includes(term) ||
        emp.position.toLowerCase().includes(term)
      );
    });
  }
}
