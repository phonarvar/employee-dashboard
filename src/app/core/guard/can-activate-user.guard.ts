import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth-service.service';

export const canActivateUser: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // We'll assume the user is logged in if _isLoggedIn signal is true
  const isLoggedIn = auth.isLoggedIn(); // this returns boolean, not signal

  if (!isLoggedIn) {
    alert('Access denied. Please log in first.');
    router.navigate(['/login']);
    return false;
  }

  return true;
};
