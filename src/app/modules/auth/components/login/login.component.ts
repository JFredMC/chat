import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IUser } from '../../interfaces/interface.interface';
import { AuthService } from '../../services/auth.service';
import { SweetAlertService } from '../../../../shared/utils/sweet-alert.service';
import { NgOtpInputModule } from  'ng-otp-input';
import { ValidatorsService } from '../../../../shared/utils/validators.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgOtpInputModule,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  public loginForm: FormGroup;
  public currentUser?: IUser = undefined;
  public isLoadingBtnLogin: boolean = false;

  @Output()
  public isLoggedIn: EventEmitter<boolean> = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private validatorsService: ValidatorsService,
    private sweetAlertService: SweetAlertService,
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(6)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    this.resetForm();
  }


  ngOnDestroy(): void {
    this.resetForm();
  }

  login(): void {
    if (this.loginForm.controls['username'].invalid && this.loginForm.controls['password'].invalid) {
      this.loginForm.controls['username'].markAsTouched();
      this.loginForm.controls['password'].markAsTouched();
      return;
    }

    this.isLoadingBtnLogin = true;

    const data = this.loginForm.value;

    this.authService.login(data)
      .subscribe({
        next: () => {
          this.isLoadingBtnLogin = false;
          this.currentUser = this.authService.currentUser;
          if (this.currentUser!.isActive) {
            this.resetForm();
            location.replace("/");
          }
        },
        error: (errorMessage: any) => {
          this.isLoadingBtnLogin = false;
          this.sweetAlertService.alert('error', 'LOGIN', `${errorMessage}`);
        }
      });
  }

  resetForm(): void {
    this.loginForm.reset();
  }

  isValidField(field: string): boolean | null {
    return this.validatorsService.isValidField(this.loginForm, field);
  }

  getFieldError(field: string): string | null {
    return this.validatorsService.getFieldError(this.loginForm, field);
  }
}
