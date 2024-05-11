import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  input,
  model,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  AllExpressions,
  PatentFieldLabelDict,
  PatentFields,
  QueryFilter,
} from '@ng-lab/core';
import { TippyDirective } from '@ngneat/helipopper';

@Component({
  selector: 'app-filter-item',
  templateUrl: './filter-item.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, TippyDirective],
})
export class FilterItemComponent {
  public item = model.required<QueryFilter>();
  public allowRemove = input(false);
  public keys = input<string[]>(PatentFields.map((f) => f.value));
  public operators = input<string[]>(AllExpressions);
  public keyLabelDict = input(PatentFieldLabelDict);

  @Output() public remove = new EventEmitter();

  public onValueChange(value: string) {
    this.item.update((item) => {
      item.value = value;
      return item;
    });
  }

  public onKeyChange(value: string) {
    this.item.update((item) => {
      item.key = value;
      return item;
    });
  }

  public onOperatorChange(value: string) {
    this.item.update((item) => {
      item.operator = value;
      return item;
    });
  }
}
