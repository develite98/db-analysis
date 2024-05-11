import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then((c) => c.LoginComponent),
  },
  {
    path: 'portal',
    loadChildren: () =>
      import('./pages/portal/portal.routes').then((m) => m.PORTAL_ROUTES),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];
