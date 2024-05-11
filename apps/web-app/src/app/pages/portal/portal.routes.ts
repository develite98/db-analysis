import { Routes } from '@angular/router';
import { PortalLayoutComponent } from './portal.layout';

export const PORTAL_ROUTES: Routes = [
  {
    path: '',
    component: PortalLayoutComponent,
    children: [
      {
        path: 'patent',
        data: {
          name: 'Sáng chế',
        },
        children: [
          {
            path: 'search',
            data: {
              name: 'Tìm kiếm',
            },
            loadComponent: () =>
              import('./invent/invent.component').then(
                (c) => c.InventComponent
              ),
          },
          {
            path: ':patentCode',
            data: {
              name: 'Chi tiết',
            },
            loadComponent: () =>
              import('./patent-detail/patent-detail.component').then(
                (c) => c.PatentDetailComponent
              ),
          },
          {
            path: '',
            redirectTo: 'search',
            pathMatch: 'full',
          },
        ],
      },
      {
        path: 'users',
        data: {
          name: 'Người dùng',
        },
        loadComponent: () =>
          import('./users/users.component').then((c) => c.UsersComponent),
      },
      {
        path: 'permissions',
        data: {
          name: 'Phân quyền',
        },
        loadComponent: () =>
          import('./permissions/permissions.component').then(
            (c) => c.PermissionsComponent
          ),
      },
      {
        path: 'categories',
        data: {
          name: 'Danh mục',
        },
        loadComponent: () =>
          import('./categories/categories.component').then(
            (c) => c.CategoriesComponent
          ),
      },
      {
        path: '',
        redirectTo: 'patent',
        pathMatch: 'full',
      },
    ],
  },
];
