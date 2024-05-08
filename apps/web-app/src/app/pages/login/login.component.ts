import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  AuthService,
  FormErrorTooltipDirective,
  FormHelper,
} from '@ng-lab/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FormErrorTooltipDirective, ReactiveFormsModule],
})
export class LoginComponent {
  public authService = inject(AuthService);
  public loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  public onSubmit() {
    if (FormHelper.validateForm(this.loginForm)) {
      console.log(123);
    }
  }
}
