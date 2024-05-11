import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  FiltersComponent,
  InputQueryBuilderComponent,
  PageHeaderComponent,
  PaginationComponent,
} from '@ng-lab/ui-controls';
import { FilterItemComponent } from '../../../shares/components/filter-item/filter-item.component';
import { PatentCardComponent } from '../../../shares/components/patent-card/patent-card.component';
import { PatentStore } from '../../../shares/stores/patent.store';
import { TippyDirective } from '@ngneat/helipopper';
import { ActivatedRoute, Router } from '@angular/router';
import { Patent } from '@ng-lab/core';

@Component({
  selector: 'app-invent',
  standalone: true,
  imports: [
    PageHeaderComponent,
    FiltersComponent,
    InputQueryBuilderComponent,
    FilterItemComponent,
    FormsModule,
    PatentCardComponent,
    TippyDirective,
    PaginationComponent,
  ],
  templateUrl: './invent.component.html',
  styleUrl: './invent.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InventComponent {
  public patentStore = inject(PatentStore);
  public router = inject(Router);
  public activeRoute = inject(ActivatedRoute);

  public goDetail(patent: Patent) {
    this.router.navigate(['detail'], {
      relativeTo: this.activeRoute.parent,
      queryParams: { patentCode: patent.patentCode },
    });
  }
}
