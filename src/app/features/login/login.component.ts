import { Component, Inject } from '@angular/core';
import { Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth/auth.service';
import { COMMON_CONST } from 'src/app/shared/constants/common.constant';
import { APP_ROUTES } from 'src/app/shared/constants/routes.constant';
import { SharedModule } from 'src/app/shared/modules/shared.module';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  hidePassword = true;

  // Flag to track if form has been submitted
  formSubmitted!: boolean;

  // Injecting services and components
  constructor(
    private _formBuilder: FormBuilder,
    private _authService: AuthService,
    @Inject(Router) private _router: Router
  ) {
    //void
  }

  // Login form using FormBuilder
  logInForm = this._formBuilder.group({
    email: [
      '',
      [
        Validators.required,
        Validators.email,
        Validators.maxLength(COMMON_CONST.EMAIL_MAX_LIMIT),
      ],
    ],
    password: ['', [Validators.required]],
  });

  // Getter function to access form controls
  get f(): { [key: string]: AbstractControl } {
    return this.logInForm.controls;
  }

  onForgotPasswordClick(): void {
    // TODO - for the forgot password code
    console.log('forgetPassword');
  }

  // Function triggered on login button click
  onLogInClick(): void {
    // Setting formSubmitted flag to true
    this.formSubmitted = true;
    // Checking if form is valid
    if (this.logInForm.valid) {
      this._router.navigate([APP_ROUTES.USERS]);

      //Note :  The code will be uncommented after the Firebase key is updated.
      // Calling AuthService signIn method
      // this._authService.signIn(
      //   this.f['email'].value as string,
      //   this.f['password'].value as string
      // );
    }
  }
}
