import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IContact } from '../../../models/models.model';
import { catchError, first, of, Subscription } from 'rxjs';
import { ContactService } from '../../services/contact.service';
import { IUser } from '../../auth/interfaces/interface.interface';
import { AuthService } from '../../auth/services/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditContactComponent } from './components/edit-contact/edit-contact.component';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss'
})
export class ContactComponent  {
  public currentUser?: IUser | null = null;
  private currentUserSub?: Subscription;
  contacts: IContact[] = [];
  private subscriptions: Subscription[] = [];

  constructor(
    private contactsService: ContactService,
    private authService: AuthService,
    private modalService: NgbModal,
  ) {}

  ngOnInit(): void {
    this.authService.loading(true);
    this.authService.currentUserSub$.subscribe(user => {
      this.currentUser = user!;
    });

    this.authService.loading(false);
    this.loadData();
  }

  loadData(): void {
    const userId = this.currentUser!.id
    const sb = this.
      contactsService.findAllByUserId(userId)
      .pipe(
        first(),
        catchError((errorMessage) => {
          this.modalService.dismissAll();
          return of(this.contacts);
        })
      )
      .subscribe(async (resp) => {
        console.log('contacts: ', resp);
        this.contacts = resp;
      });
    this.subscriptions.push(sb);
  }

  create() {
		const modalRef = this.modalService.open(EditContactComponent, {
      size: 'xl',
      fullscreen: 'xxl',
      modalDialogClass: 'modal-fullscreen'
		});
		modalRef.result.then(
      () => {},
      () => {}
		);
	}

  edit(id: any) {
		const modalRef = this.modalService.open(EditContactComponent, {
      size: 'xl',
      fullscreen: 'xxl',
      modalDialogClass: 'modal-fullscreen'
		});
    modalRef.componentInstance.id = id;
		modalRef.result.then(
      () => {},
      () => {}
		);
	}

}
