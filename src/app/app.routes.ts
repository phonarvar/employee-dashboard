import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { EMPLOYEES_ROUTES } from './features/employees/employees.routes';
import { LoginComponent } from './features/login/login.component';
import { EmployeeFormComponent } from './features/employees/employee-form/employee-form.component'; //remove later
import { canActivateAdmin } from './core/guard/can-activate-admin.guard';
import { RealUsersComponent } from './features/real-users/real-users.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent, //eager loaded
    children: [
      {
        path: 'dashboard', //lazy loaded
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(
            ////import returns promise resolved with module object so need to access comp
            (m) => m.DashboardComponent
          ),
      },
      {
        path: 'employees',
        loadChildren: () => Promise.resolve(EMPLOYEES_ROUTES), //Angular expects the loadChildren function to return
        //a Promise that resolves to an object with a routes property
      },
      {
        path: 'departments',
        loadComponent: () =>
          import('./features/departments/departments.component').then(
            (m) => m.DepartmentsComponent
          ),
      },
      {
        path: 'departments/:id/employees', // employees for specific department
        loadComponent: () =>
          import(
            './features/departments/department-employees/department-employees.component'
          ).then((m) => m.DepartmentEmployeesComponent),
        canActivate: [canActivateAdmin], // admins guard
      },
      {
        path: 'leave-requests',
        loadComponent: () =>
          import('./features/leave-requests/leave-requests.component').then(
            (m) => m.LeaveRequestsComponent
          ),
        canActivate: [canActivateAdmin],
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./features/settings/settings.component').then(
            (m) => m.SettingsComponent
          ),
      },

      //placeholder for other children
    ],
  },

  {
    path: 'login', // separate route outside layout because it's global
    component: LoginComponent,
  },
  {
    path: 'real-users', //the only purpose of this page is to showcase real API call instead of mock data
    loadComponent: () =>
      import('./features/real-users/real-users.component').then(
        (m) => m.RealUsersComponent
      ),
  },
  {
    path: '**', //wildcard
    redirectTo: '',
  },
];
