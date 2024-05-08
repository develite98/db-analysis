import {
  DestroyRef,
  Directive,
  ElementRef,
  Inject,
  Optional,
  Self,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  ControlValueAccessor,
  NgControl,
} from '@angular/forms';
import { TippyInstance, TippyService } from '@ngneat/helipopper';
import { ERROR_MAP, ErrorMap } from './error-map';

@Directive({
  selector: '[formErrorTooltip]',
  standalone: true,
})
export class FormErrorTooltipDirective implements ControlValueAccessor {
  public errorMsg = signal<string | null>(null);
  public destroyRef = inject(DestroyRef);
  public tippy = inject(TippyService);
  public tippyInstance?: TippyInstance;

  constructor(
    @Optional()
    @Self()
    @Inject(NgControl)
    private readonly ngControl: NgControl | null,
    @Inject(ERROR_MAP) public errorMap: ErrorMap,
    public elementRef: ElementRef
  ) {
    if (ngControl && !ngControl.valueAccessor) {
      ngControl.valueAccessor = this;
    }
  }
  registerOnChange(): void {
    //
  }

  registerOnTouched(): void {
    //
  }

  setDisabledState(): void {
    //
  }

  writeValue(): void {
    //
  }

  ngOnInit() {
    this.control?.statusChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        if (this.invalid && this.touched) {
          if (!this.tippyInstance) {
            this.tippyInstance = this.tippy.create(
              this.elementRef.nativeElement,
              this.error || 'Invalid error',
              {
                // variation: 'popper',
                placement: 'bottom',
                trigger: 'manual',
                className: 'form-error-tooltip',
                interactive: true,
                hideOnClick: false,
              }
            );
          }

          this.tippyInstance.show();
        } else {
          this.tippyInstance?.hide();
        }
      });
  }

  get computedError(): string | null {
    return this.invalid && this.touched ? this.error : null;
  }

  private get error(): string | null {
    if (!this.control?.errors) return null;

    const error = Object.keys(this.control?.errors)[0];
    const errorValue = this.control?.errors[error];

    return this.errorMap[error]
      ? this.errorMap[error](errorValue)
      : 'Invalid field';
  }

  public get control(): AbstractControl | null {
    return this.ngControl?.control || null;
  }

  public get invalid(): boolean {
    return !!this.control?.invalid;
  }

  public get touched(): boolean {
    return !!this.control?.touched || !!this.control?.dirty;
  }

  ngOnDestroy() {
    this.tippyInstance?.destroy();
  }
}
