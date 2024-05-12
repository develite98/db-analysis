import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  effect,
  model,
  signal,
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
  imports: [TippyDirective, FormsModule, AsyncPipe],
  templateUrl: './input-query-builder.component.html',
  styleUrl: './input-query-builder.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputQueryBuilderComponent {
  public pattern =
    /(AND|OR|XOR)\s+(patentCode|patentNo|patentName|title|applicantNo|summary)\s+(?:[^"\s]+|"[^"]+")/g;

  public showAutocomplete = signal(false);
  public searchText = model('');
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

  @Output() public addFilter = new EventEmitter<string>();
  @Output() public searchChange = new EventEmitter();

  constructor() {
    effect(
      () => {
        const value = this.searchText();
        let text = value;
        const matched = value.match(this.pattern);
        text = value.replace(this.pattern, '');

        if (matched) {
          for (let i = 0; i < matched?.length - 1; i++) {
            text = text.replace(' ', '');
          }
        }

        const isMatchAndFull = matched && matched.length > 0 && !text;

        const words = (
          text === ' ' || (text.startsWith(' ') && text.length >= 2)
            ? text.replace(' ', '')
            : text
        ).split(' ');

        this.processOptions(words, isMatchAndFull);
        this.searchChange.emit(value);
      },
      { allowSignalWrites: true }
    );
  }

  public processOptions(values: string[], isMatchAndFull: boolean | null) {
    const length = values.length;

    if (length >= 3 || isMatchAndFull) {
      this.step = Action.Value;
      const [operator, key, ...value] = values;
      this.filteredOptions.set(
        this.dict[2].options.filter((o) => o.includes(value.join(' ')))
      );
      return;
    }

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

    if (length === 2) {
      this.step = Action.Operator;
      this.filteredOptions.set(
        this.dict[1].options.filter((o) => o.includes(values[1]))
      );
      return;
    }
  }

  public add() {
    const words = ((this.searchText() as string) || '').split(' ') || [];
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

    this.searchText.update(() => word + ' ');
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
    // const words = ((this.searchControl.value as string) || '').split(' ') || [];
    // const length = words.length;
    // if (length < 3) return false;

    // const [key, operator, ...value] = words;
    // const searchText = value.join(' ').trim();
    // if (!searchText) return false;

    return true;
  }
}
