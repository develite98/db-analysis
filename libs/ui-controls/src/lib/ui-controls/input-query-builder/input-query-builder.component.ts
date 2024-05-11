import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  signal,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { AllExpressions, PatentFields, QueryFilter } from '@ng-lab/core';
import { TippyDirective } from '@ngneat/helipopper';
import { startWith } from 'rxjs';

export enum Action {
  Field = 'Field',
  Operator = 'Operator',
  Value = 'Value',
  Expression = 'Expression',
}

@Component({
  selector: 'lib-input-query-builder',
  standalone: true,
  imports: [TippyDirective, ReactiveFormsModule, AsyncPipe],
  templateUrl: './input-query-builder.component.html',
  styleUrl: './input-query-builder.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputQueryBuilderComponent {
  public showAutocomplete = signal(false);
  public searchControl = new FormControl();
  public filteredOptions = signal<string[]>([]);
  public activeIndex = 0;
  public step: Action = Action.Field;
  public ACTION = Action;
  public dict = {
    0: {
      action: Action.Operator,
      options: AllExpressions as string[],
    },
    1: {
      action: Action.Field,
      options: PatentFields.map((x) => x.value),
    },
    2: {
      action: Action.Value,
      options: <string[]>[],
    },
  };

  @Output() public addFilter = new EventEmitter<QueryFilter>();

  constructor() {
    this.searchControl.valueChanges.pipe(startWith('')).subscribe((value) => {
      const words = value.split(' ');
      this.processOptions(words || []);
    });
  }

  public processOptions(values: string[]) {
    const length = values.length;
    this.step = Action.Field;
    if (length === 0) {
      this.filteredOptions.set(this.dict[0].options);
      return;
    }

    if (length === 1) {
      this.filteredOptions.set(
        this.dict[0].options.filter((o) => o.includes(values[0]))
      );
      return;
    }

    this.step = Action.Operator;
    if (length === 2) {
      this.filteredOptions.set(
        this.dict[1].options.filter((o) => o.includes(values[1]))
      );
      return;
    }

    this.step = Action.Value;
    if (length >= 3) {
      const [operator, key, ...value] = values;
      this.filteredOptions.set(
        this.dict[2].options.filter((o) => o.includes(value.join(' ')))
      );
      return;
    }
  }

  public add() {
    const words = ((this.searchControl.value as string) || '').split(' ') || [];
    if (this.validate()) {
      const [operator, key, ...value] = words;
      this.addFilter.emit({
        key: key,
        operator: operator,
        value: value.join(' ').trim(),
      });

      this.searchControl.patchValue('');
    } else {
      const optionToInSearch = this.filteredOptions()[this.activeIndex];

      const latestWords = words[words.length - 1];
      if (!latestWords) {
        words.push(optionToInSearch);
      } else {
        words[words.length - 1] = optionToInSearch;
      }

      const word = words
        .filter(Boolean)
        .reduce((a, b) => `${a} ${b}`, '')
        .trim();

      this.searchControl.patchValue(word);
    }
  }

  public moveNext(event: Event) {
    event.preventDefault();
    event.stopPropagation();

    if (this.activeIndex < this.filteredOptions().length - 1) {
      this.activeIndex += 1;
    } else {
      this.activeIndex = 0;
    }
  }

  public movePrevious(event: Event) {
    event.preventDefault();
    event.stopPropagation();

    if (this.activeIndex === 0) {
      this.activeIndex = this.filteredOptions().length - 1;
    } else {
      this.activeIndex -= 1;
    }
  }

  public validate() {
    const words = ((this.searchControl.value as string) || '').split(' ') || [];
    const length = words.length;
    if (length < 3) return false;

    const [key, operator, ...value] = words;
    const searchText = value.join(' ').trim();
    if (!searchText) return false;

    return true;
  }
}
