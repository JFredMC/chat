import { Component, Input } from '@angular/core';
import { IContact } from '../../../../../models/models.model';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ValidatorsService } from '../../../../../shared/utils/validators.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { ContactService } from '../../../../services/contact.service';
import { SweetAlertService } from '../../../../../shared/utils/sweet-alert.service';
import { IUser } from '../../../../auth/interfaces/interface.interface';
import { catchError, first, of, Subscription } from 'rxjs';
import { AuthService } from '../../../../auth/services/auth.service';

@Component({
  selector: 'app-edit-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './edit-contact.component.html',
  styleUrl: './edit-contact.component.scss'
})
export class EditContactComponent {
  @Input() contact: IContact | null = null;
  @Input() id: number | null = null;
  contactForm: FormGroup;
  public currentUser?: IUser | null = null;

  constructor(
    private contactsService: ContactService,
    private fb: FormBuilder,
    private validatorsService: ValidatorsService,
    public modal: NgbActiveModal,
    private sweetAlertService: SweetAlertService,
    private authService: AuthService,
  ) {
    this.contactForm = this.fb.group({
      username: ['', Validators.required],
      // Agrega más campos según tu entidad Contact
    });
  }

  ngOnInit(): void {
    this.authService.loading(true);
    this.authService.currentUserSub$.subscribe(user => {
      this.currentUser = user!;
    });
    this.loadData();
    this.authService.loading(false);
  }

  loadData(){
    if (!this.id) {


    } else {
      const sb = this.contactsService
        .getById(this.id)
        .pipe(
            first(),
            catchError((errorMessage) => {
                this.modal.dismiss(errorMessage);
                return of();
            })
        )
        .subscribe((resp) => {
            
        });
    }
  }


  save(): void {

    if(this.id){
        this.edit();
    }else{
        this.create();
    }
  }

  create() {
    if (this.contactForm.invalid) {
      return;
    }

    const username = this.contactForm.get('username')!.value;
    this.contactsService.checkUsernameExists(username).subscribe(
      (user) => {
        if (user) {
          const createContact: IContact = {
            userId: this.currentUser!.id,
            contactUserId: user.id,
            status: 'accepted'
          }
          // Si el usuario existe, creamos el contacto
          this.contactsService.createContact(createContact).subscribe(() => {
            this.sweetAlertService.alert('success', 'CONTACTO', 'Contacto creado exitosamente');
            this.modal.close();
          });
        } else {
          // Si el usuario no existe, mostramos un mensaje de error
          this.sweetAlertService.alert('error', 'CONTACTO', 'El nombre de usuario no existe');
        }
      },
      (errorMessage) => {
        this.sweetAlertService.alert('error', 'CONTACTO', `${errorMessage}`);
      }
    );
  }

  edit() {
    if (this.contactForm.invalid) {
      return;
    }

    const username = this.contactForm.get('username')!.value;
    this.contactsService.checkUsernameExists(username).subscribe(
      (user) => {
        if (user) {
          const createContact: IContact = {
            userId: this.currentUser!.id,
            contactUserId: user.id,
            status: 'accepted'
          }
          // Si el usuario existe, creamos el contacto
          this.contactsService.createContact(createContact).subscribe(() => {
            this.sweetAlertService.alert('success', 'CONTACTO', 'Contacto creado exitosamente');
            this.modal.close();
          });
        } else {
          // Si el usuario no existe, mostramos un mensaje de error
          this.sweetAlertService.alert('error', 'CONTACTO', 'El nombre de usuario no existe');
        }
      },
      (errorMessage) => {
        this.sweetAlertService.alert('error', 'CONTACTO', `${errorMessage}`);
      }
    );
  }

  resetForm(): void {
    this.contactForm.reset();
  }

  isValidField(field: string): boolean | null {
    return this.validatorsService.isValidField(this.contactForm, field);
  }

  getFieldError(field: string): string | null {
    return this.validatorsService.getFieldError(this.contactForm, field);
  }
}
