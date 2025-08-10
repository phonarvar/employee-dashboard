import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Department } from './model';
import { NotificationService } from './notification.service';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DepartmentService {
  private http = inject(HttpClient);
  private notifications = inject(NotificationService);

  private apiUrl =
    'https://68802d98f1dcae717b613b25.mockapi.io/api/v1/departments';

  getDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(this.apiUrl);
  }

  addDepartment(dept: Department): Observable<Department> {
    return this.http
      .post<Department>(this.apiUrl, dept)
      .pipe(
        tap((newDept) =>
          this.notifications.addNotification(
            `New department created: ${newDept.name}`
          )
        )
      );
  }

  updateDepartment(dept: Department): Observable<Department> {
    return this.http
      .put<Department>(`${this.apiUrl}/${dept.id}`, dept)
      .pipe(
        tap(() =>
          this.notifications.addNotification(`Department updated: ${dept.name}`)
        )
      );
  }

  deleteDepartment(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
