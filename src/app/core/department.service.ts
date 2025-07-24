import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Department } from './model';

@Injectable({ providedIn: 'root' })
export class DepartmentService {
  private http = inject(HttpClient);
  private apiUrl =
    'https://68802d98f1dcae717b613b25.mockapi.io/api/v1/departments';

  getDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(this.apiUrl);
  }

  addDepartment(dept: Department): Observable<Department> {
    return this.http.post<Department>(this.apiUrl, dept);
  }

  updateDepartment(dept: Department): Observable<Department> {
    return this.http.put<Department>(`${this.apiUrl}/${dept.id}`, dept);
  }

  deleteDepartment(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
