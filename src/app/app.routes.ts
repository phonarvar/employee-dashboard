import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { LoginComponent } from './features/login/login.component';
import { EmployeeFormComponent } from './features/employees/employee-form/employee-form.component'; //remove later
import { RealUsersComponent } from './features/real-users/real-users.component';
import { LeaveRequestFormComponent } from './features/leave-requests/leave-request-form/leave-request-form.component';
import { canActivateAdmin } from './core/guard/can-activate-admin.guard';
import { canActivateUser } from './core/guard/can-activate-user.guard';
import { roleRedirectGuard } from './core/guard/role-redirect.guard';

export const routes: Routes = [
  {
    path: '', //outer path, means when url is the root of application, the MainLayoutComponent is loaded
    component: MainLayoutComponent, //eager loaded
    children: [ //have router-outlet inside mainlayoutcomp.html so these children render there
      {
        path: '', //inner path, It means that within the MainLayoutComponent's <router-outlet> when no child path is provided redirect to dashboard
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard', //lazy loaded
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(
            ////import returns promise resolved with module object so need to access comp
            (m) => m.DashboardComponent
          ),
      },
      {
        path: 'employees', //use loadChildren when grouping otherwise use loadComponent
        loadChildren: () => import('./features/employees/employees.routes').then( //changed the promise to directly import route file instead
          (m) => m.EMPLOYEES_ROUTES ),
        
      },
      {
        path: 'departments',
        loadComponent: () =>
          import('./features/departments/departments.component').then(
            (m) => m.DepartmentsComponent
          ),
      },
      {
        path: 'departments/manage',
        loadComponent: () =>
          import('./features/departments/departments-manage.component').then(
            (m) => m.DepartmentsManageComponent
          ),
        canActivate: [canActivateAdmin],
      },
      {
        path: 'departments/:name', // was employees for specific department, now route for each department by name
        loadComponent: () =>
          import(
            './features/departments/department-employees/department-employees.component'
          ).then((m) => m.DepartmentEmployeesComponent),
        canActivate: [canActivateAdmin], // admins guard
      },
      {
        path: 'leave-requests',
        loadChildren: () =>
          import('./features/leave-requests/leave-requests.routes').then(
            (m) => m.LEAVE_REQUEST_ROUTES
          ),
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
    // I should technically remove it since now the entire app uses real API calls instead of local mock data
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
