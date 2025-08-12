import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth-service.service';

export const canActivateUser: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const isLoggedIn = auth.isLoggedIn();

  if (!isLoggedIn) {
    alert('Access denied. Please log in first.');
    router.navigate(['/login'], { queryParams: { redirectTo: state.url } });
    return false;
  }

  return true;
};
