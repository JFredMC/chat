import { Component, } from '@angular/core';
import { IChat, IMessage } from '../../models/models.model';
import { FormsModule, } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {  Subject, Subscription } from 'rxjs';
import { AuthService } from '../auth/services/auth.service';
import { ChatPrivateComponent } from "./chat-private/chat-private.component";
import { IUser } from '../auth/interfaces/interface.interface';
import { SweetAlertService } from '../../shared/utils/sweet-alert.service';
import { Router } from '@angular/router';
import { ChatComponent } from "./chat/chat.component";
import { ProfileComponent } from "./profile/profile.component";
import { ContactComponent } from "./contacts/contacts.component";

@Component({
  selector: 'app-chat-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ChatPrivateComponent, ChatComponent, ProfileComponent, ContactComponent],
  templateUrl: './chat-dashboard.component.html',
  styleUrl: './chat-dashboard.component.scss'
})
export class ChatDashboardComponent {
  chatCreated$ = new Subject<IChat>();
  public currentUser?: IUser | null = null;
  private currentUserSub?: Subscription;
  searchTerm = '';
  newMessage = '';
  
  chats: IChat[] = [];
  messages: IMessage[] = [];
  chatVisible: boolean = false;
  logoutMenuOpen = false;
  selectedComponent: string = 'chat';

  private subscriptions: Subscription[] = [];

  public constructor(
    private authService: AuthService,
    private sweetAlertService: SweetAlertService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.authService.loading(true);
    this.authService.currentUserSub$.subscribe(user => {
      this.currentUser = user!;
    });

    this.authService.loading(false);
  }

  ngOnDestroy(): void {
    if (this.currentUserSub) {
      this.currentUserSub.unsubscribe();
    }
  }

  changeComponent(component: string) {
    this.selectedComponent = component;
  }

  toggleLogoutMenu() {
    this.logoutMenuOpen = !this.logoutMenuOpen;
  }

  logout(): void {
    this.sweetAlertService.confirm(
      'question', 'LOGOUT', '¿Estás seguro que deseas cerrar la sesión?'
    ).then((confirm) =>{
      if (confirm) {
        this.authService.logout();
        this.router.navigate(['/']);
      }
    });
  }
}
