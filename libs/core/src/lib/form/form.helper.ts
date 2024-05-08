import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
} from '@angular/forms';

export class FormHelper {
  public static validateForm(toValidateForm: FormGroup | FormControl): boolean {
    if (toValidateForm instanceof FormControl) {
      toValidateForm.markAsDirty();
      toValidateForm.markAsTouched();
      toValidateForm.updateValueAndValidity({ onlySelf: true });
      return toValidateForm.valid;
    }

    const form = toValidateForm as FormGroup;

    if (!form.controls) {
      return form.valid;
    }

    Object.values(form.controls).forEach((control: AbstractControl) => {
      if (control.invalid) {
        control.markAsDirty();
        control.markAsTouched();
        control.updateValueAndValidity({ onlySelf: true });
      }

      if (control instanceof FormArray)
        control.controls.some(
          (form: AbstractControl) =>
            !FormHelper.validateForm(form as FormGroup),
        );
    });

    return form.valid;
  }
}
