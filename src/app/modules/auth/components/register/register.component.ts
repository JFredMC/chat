import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IUser } from '../../interfaces/interface.interface';
import { AuthService } from '../../services/auth.service';
import { SweetAlertService } from '../../../../shared/utils/sweet-alert.service';
import { ValidatorsService } from '../../../../shared/utils/validators.service';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      RouterLink
    ],
    templateUrl: './register.component.html',
    styleUrl: './register.component.scss'
})
export class RegisterComponent {
    currentStep = 1;
    countryControl = new FormControl();
    searchControl = new FormControl();

    config = {
      length: 6,
      // Otras configuraciones
    };

    public loginForm: FormGroup;
    public currentUser?: IUser = undefined;
    public isLoadingBtnLogin: boolean = false;

    public imageUrl?: string = '';
    public imageFileName?: string = '';

    @Output()
    public isLoggedIn: EventEmitter<boolean> = new EventEmitter();

    constructor(
      private fb: FormBuilder,
      private router: Router,
      private authService: AuthService,
      private validatorsService: ValidatorsService,
      private sweetAlertService: SweetAlertService,
    ) {
      this.loginForm = this.fb.group({
        names: ['', [Validators.required, Validators.minLength(6)]],
        username: ['', [Validators.required, Validators.minLength(6)]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        profilePictureFile: ['', [], []],
        profilePictureFileSource: ['', [], []],
      });
    }

    ngOnInit(): void {
      this.resetForm();
    }


    ngOnDestroy(): void {
      this.resetForm();
    }

    goToNextStep() {
      console.log('currentStep: ', this.currentStep)
      if (this.currentStep === 1) {
        if (this.loginForm.controls['names'].invalid) {
          this.loginForm.controls['names'].markAsTouched();
        } else {
          this.currentStep++;
        }
      }else if (this.currentStep === 2) {
        if (this.loginForm.controls['username'].invalid && this.loginForm.controls['password'].invalid) {
          this.loginForm.controls['username'].markAsTouched();
          this.loginForm.controls['password'].markAsTouched();
        } else {
          this.currentStep++;
        }
      }else if (this.currentStep === 3) {
        this.createUser();
      }
    }

    goToPreviousStep() {
      if (this.currentStep > 1) {
        this.currentStep--;
      }
    }

    createUser(): void {
      const data = this.loginForm.value;
      console.log(data);
      const formData = new FormData();

      formData.append('names', data.names );
      formData.append('username', data.username );
      formData.append('password', data.password );

      if (data.profilePictureFileSource instanceof File) {
        formData.append('profilePictureFile', data.profilePictureFileSource);
      }

      console.log(formData);
      
      this.authService.create(formData)
        .subscribe({
          next: () => {
            this.isLoadingBtnLogin = false;
            this.currentUser = this.authService.currentUser;
            this.login(data);
          },
          error: (errorMessage) => {
            this.isLoadingBtnLogin = false;
            this.sweetAlertService.alert('error', 'Usuario', `Ocurrio un error: ${errorMessage}`);
          }
        });
    }

    login(data: any): void {
      this.isLoadingBtnLogin = true;
      const dataLogin = {
        username: data.username,
        password: data.password,
      }

      this.authService.login(dataLogin)
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
            this.sweetAlertService.toast('error', 'LOGIN', `${errorMessage}`);
          }
        });
    }

    onSelectImage(event: Event): void {
      const element = (event.target as HTMLInputElement);
      const file = element.files?.item(0);

      if (file) {
        let reader = new FileReader();
        reader.readAsDataURL( file );
        reader.onload = (events: any) => {
          this.imageUrl = events.target.result;
          this.imageFileName = file.name;
        }

        this.loginForm.patchValue({
          profilePictureFileSource: file
        });
      }
    }

    onDeleteImage(event: Event): void {
      this.imageUrl = '/img/defaultProfilePicture.png';
      this.imageFileName = '';

      this.loginForm.patchValue({
        profilePictureFileSource: ''
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
