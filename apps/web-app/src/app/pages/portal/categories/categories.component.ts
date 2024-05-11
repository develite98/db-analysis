import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FiltersComponent, PageHeaderComponent } from '@ng-lab/ui-controls';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [PageHeaderComponent, FiltersComponent],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesComponent {}
