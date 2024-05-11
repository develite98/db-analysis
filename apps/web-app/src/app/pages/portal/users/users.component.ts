import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FiltersComponent, PageHeaderComponent } from '@ng-lab/ui-controls';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [PageHeaderComponent, FiltersComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersComponent {}
