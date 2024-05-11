import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ActivatedRoute,
  NavigationEnd,
  PRIMARY_OUTLET,
  Router,
  RouterModule,
} from '@angular/router';
import { BreadcrumbOption } from '@ng-lab/core';
import { ThemeToggleComponent } from '@ng-lab/ui-controls';
import { filter, startWith } from 'rxjs';

export interface MenuItem {
  title: string;
  url: string | undefined;
  icon: string;
  children?: MenuItem[];
}

@Component({
  selector: 'app-portal',
  templateUrl: './portal.layout.html',
  styleUrls: ['./portal.layout.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule, ThemeToggleComponent],
})
export class PortalLayoutComponent {
  public expand = signal(false);
  public router = inject(Router);
  public activatedRoute = inject(ActivatedRoute);
  public destroyRef = inject(DestroyRef);

  public breadcrumbs = signal<BreadcrumbOption[]>([]);
  public menuItems = signal<MenuItem[]>([
    {
      title: 'Sáng chế',
      url: undefined,
      children: [
        {
          title: 'Tìm kiếm',
          url: 'patent/search',
          icon: 'list',
        },
        {
          title: 'Báo cáo',
          url: undefined,
          icon: 'analytics',
        },
      ],
      icon: 'inventory',
    },
    {
      title: 'Phi sáng chế',
      url: undefined,
      children: [
        {
          title: 'Tìm kiếm',
          url: undefined,
          icon: 'list',
        },
        {
          title: 'Báo cáo',
          url: undefined,
          icon: 'analytics',
        },
      ],
      icon: 'texture_add',
    },
    {
      title: 'Danh mục',
      url: 'categories',
      children: [],
      icon: 'category',
    },
    {
      title: 'Người dùng',
      url: 'users',
      children: [],
      icon: 'group',
    },
    {
      title: 'Phân quyền',
      url: 'permissions',
      children: [],
      icon: 'verified_user',
    },
  ]);

  constructor() {
    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
        startWith(true)
      )
      .subscribe(() => {
        this.breadcrumbs.set(this._getBreadcrumbs(this.activatedRoute.root));
      });
  }

  private _getBreadcrumbs(
    route: ActivatedRoute,
    url = '',
    breadcrumbs: BreadcrumbOption[] = []
  ): BreadcrumbOption[] {
    const children: ActivatedRoute[] = route.children;
    if (children.length === 0) {
      return breadcrumbs;
    }

    for (const child of children) {
      if (child.outlet === PRIMARY_OUTLET) {
        const routeUrl: string = (child.snapshot?.url || [])
          .map((segment) => segment.path)
          .filter((path) => path)
          .join('/');

        const nextUrl = routeUrl ? `${url}/${routeUrl}` : url;
        const breadcrumbLabel = child.snapshot?.data['name'];

        if (routeUrl && breadcrumbLabel) {
          const breadcrumb: BreadcrumbOption = {
            label: breadcrumbLabel,
            params: child.snapshot.params,
            url: nextUrl,
          };

          breadcrumbs.push(breadcrumb);
        }

        return this._getBreadcrumbs(child, nextUrl, breadcrumbs);
      }
    }

    return breadcrumbs;
  }
}
