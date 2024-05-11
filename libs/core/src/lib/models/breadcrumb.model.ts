import { Params } from '@angular/router';

export interface BreadcrumbOption {
  label: string;
  params: Params;
  url: string;
}
