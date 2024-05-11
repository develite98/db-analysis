import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FiltersComponent, PageHeaderComponent } from '@ng-lab/ui-controls';

@Component({
  selector: 'app-permissions',
  standalone: true,
  imports: [PageHeaderComponent, FiltersComponent],
  templateUrl: './permissions.component.html',
  styleUrl: './permissions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PermissionsComponent {}
