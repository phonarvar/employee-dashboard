import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth-service.service';

export const canActivateAdmin: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isAdmin = authService.isAdmin(); // signal() call

  if (!isAdmin) {
    alert('Access denied. Admins only.');
    router.navigate(['/login']);
    return false;
  }

  return true;
};
