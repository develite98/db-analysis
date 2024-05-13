import { DatePipe, JsonPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  computed,
  input,
} from '@angular/core';
import { Patent } from '@ng-lab/core';

@Component({
  selector: 'app-patent-card',
  templateUrl: './patent-card.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JsonPipe, DatePipe],
})
export class PatentCardComponent {
  public patent = input.required<Patent>();
  public no = input(1);

  public publicDate = computed(() => {
    return this.patent().publicationDate.replace('00:00:00', '');
  });

  @Output() public titleClick = new EventEmitter();
}
