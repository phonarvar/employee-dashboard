import { Injectable } from '@angular/core';
import { Employee } from './employee.model';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  //Mock Data for now, I could forget to remove this comment
  //Replace it with HttpClient + in-memory API later
  //Add methods like addEmployee(), updateEmployee(), deleteEmployee()
  private employees: Employee[] = [
    {
      id: 1,
      name: 'Alice Johnson',
      position: 'Frontend Developer',
      department: 'Engineering',
      hireDate: '2024-12-10',
      status: 'active',
      imageUrl: 'https://i.pravatar.cc/150?img=1',
    },
    {
      id: 2,
      name: 'Bob Smith',
      position: 'Backend Developer',
      department: 'Engineering',
      hireDate: '2025-01-15',
      status: 'inactive',
      imageUrl: 'https://i.pravatar.cc/150?img=2',
    },
    {
      id: 3,
      name: 'Carol Lee',
      position: 'Product Manager',
      department: 'Product',
      hireDate: '2025-07-01',
      status: 'active',
      imageUrl: 'https://i.pravatar.cc/150?img=3',
    },
    {
      id: 4,
      name: 'David Kim',
      position: 'Designer',
      department: 'Design',
      hireDate: '2025-06-15',
      status: 'active',
      imageUrl: 'https://i.pravatar.cc/150?img=4',
    },
  ];

  constructor() {}

  getEmployees(): Employee[] {
    return this.employees;
  }

  addEmployee(employee: Employee): void {
    //generate ID
    const newId =
      this.employees.length > 0
        ? Math.max(...this.employees.map((e) => e.id)) + 1
        : 1;

    const newEmployee = { ...employee, id: newId };
    this.employees.push(newEmployee);
  }

  updateEmployee(updatedEmployee: Employee): void {
    const index = this.employees.findIndex((e) => e.id === updatedEmployee.id);
    if (index !== -1) {
      this.employees[index] = updatedEmployee;
    }
  }
}
