import {
  ChangeDetectionStrategy,
  Component,
  effect,
  input,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Pagination } from '@ng-lab/core';

@Component({
  selector: 'lib-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationComponent {
  public pagingInfo = input<Pagination>();
  public start = signal(0);
  public end = signal(0);

  constructor() {
    effect(
      () => {
        console;
        const pageIndex = (this.pagingInfo()?.currentPage || 1) - 1;
        const pageSize = this.pagingInfo()?.size || 1;
        const elements = this.pagingInfo()?.numberOfElements || 0;
        const start = pageIndex * pageSize + 1;
        this.start.set(start);
        this.end.set(start + elements - 1);
      },
      { allowSignalWrites: true }
    );
  }
}
