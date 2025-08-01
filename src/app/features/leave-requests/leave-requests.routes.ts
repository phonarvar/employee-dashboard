import { Routes } from '@angular/router';
import { LeaveRequestsComponent } from './leave-requests.component';
import { LeaveRequestFormComponent } from './leave-request-form/leave-request-form.component';
import { canActivateUser } from '../../core/guard/can-activate-user.guard';
import { roleRedirectGuard } from '../../core/guard/role-redirect.guard';

export const LEAVE_REQUEST_ROUTES: Routes = [
  {
    path: '',
    component: LeaveRequestsComponent,
    canActivate: [roleRedirectGuard], // Admin access
  },
  {
    path: 'form',
    component: LeaveRequestFormComponent,
    canActivate: [canActivateUser], // User access
  },
];
