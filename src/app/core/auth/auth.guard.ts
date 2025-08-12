import { inject } from '@angular/core';
import { type CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { APP_ROUTES } from 'src/app/shared/constants/routes.constant';
import { map } from 'rxjs/operators';

// AuthGuard function to protect routes that require authentication
export const AuthGuard: CanActivateFn = () => {
  const router = inject(Router);
  const _authService = inject(AuthService);
  return _authService.isLogin.pipe(
    map((value: boolean) => {
      if (value) {
        return true;
      }
      router.navigate([APP_ROUTES.LOGIN]);

      return false;
    })
  );
};
