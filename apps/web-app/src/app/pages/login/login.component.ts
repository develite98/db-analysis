import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import {
  AuthService,
  FormErrorTooltipDirective,
  FormHelper,
} from '@ng-lab/core';
import { APP_ROUTE } from '../../shares/const/APP_ROUTES';

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
  public router = inject(Router);

  public loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  public onSubmit() {
    if (FormHelper.validateForm(this.loginForm)) {
      this.router.navigateByUrl(APP_ROUTE.portal);
    }
  }
}
