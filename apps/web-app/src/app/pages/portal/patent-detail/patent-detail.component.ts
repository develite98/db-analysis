import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseComponent, Patent, PatentApiService } from '@ng-lab/core';
import { ActivatedRoute, Router } from '@angular/router';
import { delay } from 'rxjs';

@Component({
  selector: 'app-patent-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './patent-detail.component.html',
  styleUrl: './patent-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PatentDetailComponent extends BaseComponent implements OnInit {
  public activeRoute = inject(ActivatedRoute);
  public patentApi = inject(PatentApiService);
  public router = inject(Router);
  public patent = signal<Patent | undefined>(undefined);

  ngOnInit() {
    const patentCode = this.activeRoute.snapshot.queryParams['patentCode'];
    if (!patentCode) return;

    this.patentApi
      .getDetail(patentCode)
      .pipe(delay(500), this.observerLoadingStateSignal())
      .subscribe({
        next: (value) => {
          console.log(value.data);
          this.patent.set(value.data);
        },
      });
  }

  public goBack() {
    this.router.navigate(['search'], { relativeTo: this.activeRoute.parent });
  }

  public export() {
    const patent = this.patent();
    if (!patent) return;

    this.patentApi.exportExcel([patent.patentCode]).subscribe();
  }
}
