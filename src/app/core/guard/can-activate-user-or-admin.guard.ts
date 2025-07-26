import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth-service.service';

export const canActivateUserOrAdmin: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const isLoggedIn = auth.loggedInUserId() !== null;

  if (!isLoggedIn) {
    alert('You must be logged in.');
    router.navigate(['/login']);
    return false;
  }

  return true;
};
