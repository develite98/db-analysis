import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'lib-page-header',
  standalone: true,
  imports: [],
  templateUrl: './page-header.component.html',
  styleUrl: './page-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageHeaderComponent {
  public title = input('Page title');
  public description = input('Page description');
}
