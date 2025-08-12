import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth-service.service';

export const canActivateAdmin: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isAdmin = authService.isAdmin();

  if (!isAdmin) {
    alert('Access denied. Admins only.');
    router.navigate(['/login'], { queryParams: { redirectTo: state.url } });
    return false;
  }

  return true;
};
