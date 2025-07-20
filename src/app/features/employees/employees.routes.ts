import { Routes } from '@angular/router';
import { EmployeesComponent } from './employees.component';
import { EmployeeFormComponent } from './employee-form/employee-form.component';
import { canActivateAdmin } from '../../core/guard/can-activate-admin.guard';

export const EMPLOYEES_ROUTES: Routes = [
  {
    path: '',
    component: EmployeesComponent,
  },
  {
    path: 'new',
    component: EmployeeFormComponent,
    canActivate: [canActivateAdmin],
  },
  {
    path: ':id/edit',
    component: EmployeeFormComponent, //can use the same guard but left it empty on purpose
  },
];
