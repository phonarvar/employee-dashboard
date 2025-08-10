import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from './employee.model';
import { tap } from 'rxjs';
import { NotificationService } from '../../core/notification.service';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private http = inject(HttpClient);
  private notifications = inject(NotificationService);

  private apiUrl =
    'https://68802d98f1dcae717b613b25.mockapi.io/api/v1/employees';

  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.apiUrl);
  }

  getEmployee(id: string): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/${id}`);
  }

  addEmployee(emp: Partial<Employee>): Observable<Employee> {
    return this.http
      .post<Employee>(this.apiUrl, emp)
      .pipe(
        tap((newEmp) =>
          this.notifications.addNotification(
            `New employee created: ${newEmp.name}`
          )
        )
      );
  }

  updateEmployee(id: string, emp: Partial<Employee>): Observable<Employee> {
    return this.http
      .put<Employee>(`${this.apiUrl}/${id}`, emp)
      .pipe(
        tap(() =>
          this.notifications.addNotification(
            `Employee updated: ${emp.name ?? id}`
          )
        )
      );
  }

  deleteEmployee(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateStatus(id: string, status: string): Observable<Employee> {
    return this.http
      .put<Employee>(`${this.apiUrl}/${id}`, { status })
      .pipe(
        tap(() =>
          this.notifications.addNotification(
            `Employee #${id} status changed to ${status}`
          )
        )
      );
  }
}

//V2.0 completely replaced
/* import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Employee } from './employee.model';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private http = inject(HttpClient);

  //This array is now ONLY for local add/update fallback
  private employees: Employee[] = [];

  constructor() {
    this.getEmployees().subscribe((data) => (this.employees = data));
  }

  getEmployees(): Observable<Employee[]> {
    return this.http
      .get<any[]>('https://jsonplaceholder.typicode.com/users')
      .pipe(
        map((users) =>
          users.map((user) => ({
            id: user.id,
            name: user.name,
            position: 'Software Engineer',
            department: user.address?.city || 'Unknown',
            hireDate: new Date().toISOString().slice(0, 10),
            status: Math.random() > 0.5 ? 'active' : 'inactive',
            imageUrl: `https://i.pravatar.cc/150?img=${user.id}`,
          }))
        )
      );
  }

  addEmployee(employee: Employee): void {
    const newId =
      this.employees.length > 0
        ? Math.max(...this.employees.map((e) => e.id)) + 1 //find max ID and increment by 1
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

  getLocalEmployees(): Employee[] {
    return this.employees;
  }
}
  */

//V1.0 Removed the entire mock data and replaced with api calls
/**@Injectable({ 
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
    if (index !== -1) { //matching ID was found 
      this.employees[index] = updatedEmployee;
    }
  }
} */
