import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth-service.service';

export const roleRedirectGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const userId = authService.loggedInUserId();
  const isAdmin = authService.isAdmin();

  if (!userId) {
    router.navigate(['/login']);
    return false;
  }

  if (!isAdmin) {
    router.navigate(['/leave-requests/form']); // Users go to form
    return false;
  }

  return true; // Admin stays on /leave-requests
};
