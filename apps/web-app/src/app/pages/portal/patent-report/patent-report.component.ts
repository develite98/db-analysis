import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BarChartRaceComponent } from '@ng-lab/ui-controls';

@Component({
  selector: 'app-patent-report',
  templateUrl: './patent-report.component.html',
  styleUrls: ['./patent-report.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BarChartRaceComponent],
})
export class PatentReportComponent {}
