import type { Routes } from '@angular/router';
import { APP_ROUTES } from './shared/constants/routes.constant';
import { LoginComponent } from './features/login/login.component';
// import { AuthGuard } from './core/auth/auth.guard';
//This will be uncommented once the Firebase API and backend are in use.
import { UsersComponent } from './features/users/users.component';

export const routes: Routes = [
  {
    path: APP_ROUTES.EMPTY,
    component: LoginComponent,
  },
  {
    path: APP_ROUTES.LOGIN,
    component: LoginComponent,
  },
  {
    path: APP_ROUTES.USERS,
    component: UsersComponent,
    // canActivate: [AuthGuard],
  },
];
