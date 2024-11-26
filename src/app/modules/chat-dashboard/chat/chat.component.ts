import { ChangeDetectorRef, Component, EventEmitter, HostListener, Output } from '@angular/core';
import { IUser } from '../../auth/interfaces/interface.interface';
import { CommonModule } from '@angular/common';
import { catchError, concatMap, first, of, Subscription } from 'rxjs';
import { UserStatuses } from '../../auth/interfaces/enums';
import { AuthService } from '../../auth/services/auth.service';
import { UserStatusesService } from '../../services/user-statuses.service';
import { RecentChatsComponent } from '../recent-chats/recent-chats.component';
import { ContactService } from '../../services/contact.service';
import { IChat, IContact } from '../../../models/models.model';
import { ChatService } from '../../services/chat.service';
import { SweetAlertService } from '../../../shared/utils/sweet-alert.service';
import { ChatPrivateComponent } from "../chat-private/chat-private.component";

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, RecentChatsComponent, ChatPrivateComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent {
  @Output() chatCreated: EventEmitter<IChat> = new EventEmitter<IChat>();
  public currentUser?: IUser | null = null;
  private currentUserSub?: Subscription;
  private subscriptions: Subscription[] = [];
  contacts: IContact[] = [];
  chats: IChat[] = [];
  chat: IChat | null = null;
  selectedChat!: IChat;
  filteredContacts: IContact[] = [];
  filteredChats: IChat[] = [];
  showSearchResults = false;
  dropdownOpen = false;
  userStatusesList = Object.values(UserStatuses);
  isEditing = false;
  logoutMenuOpen = false;
  constructor(
    private chatService: ChatService,
    private authService: AuthService,
    private userStatusesService: UserStatusesService,
    private contactsService: ContactService,
    private sweetAlertService: SweetAlertService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.authService.loading(true);
    this.authService.currentUserSub$.subscribe(user => {
      this.currentUser = user!;
    });

    this.authService.loading(false);
    this.loadData();
  }

  ngOnDestroy(): void {
    if (this.currentUserSub) {
      this.currentUserSub.unsubscribe();
    }
  }

  loadData(): void {
    const userId = this.currentUser!.id
    const sb = this.
      contactsService.findAllByUserId(userId)
      .pipe(
        first(),
        catchError((errorMessage) => {
          return of(this.contacts);
        })
      )
      .subscribe(async (resp) => {
        this.contacts = resp;
        this.filteredContacts = resp;
      });
    this.subscriptions.push(sb);
  }

  toggleEdit() {
    if (!this.isEditing) {
      this.isEditing = true;
    }
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    // Comprobar si el clic fue fuera del textarea y el contenedor
    const isInsideComponent = target.closest('.is-editing');

    if (!isInsideComponent && this.isEditing) {
      this.isEditing = false; // Cerrar el editor si se hace clic fuera
    }
  }

  stateBadge(status: UserStatuses | undefined): { icon: string, badgeClass: string } {
    switch (status) {
      case UserStatuses.ONLINE:
        return { icon: '🟢', badgeClass: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' };
      case UserStatuses.OFFLINE:
        return { icon: '⚪', badgeClass: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300' };
      case UserStatuses.AWAY:
        return { icon: '🟡', badgeClass: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' };
      case UserStatuses.BUSY:
        return { icon: '🔴', badgeClass: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' };
      default:
        return { icon: '⚪', badgeClass: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300' };
    }
  }

  changeStatus(newStatus: UserStatuses): void {
    // Lógica para actualizar el estado del usuario
    const userStatus = {
      status: newStatus
    };
    const id = this.currentUser!.userStatus.id;
    // Llamar al servicio para guardar el nuevo estado en el backend si es necesario
    this.userStatusesService.updateUserStatus(id, userStatus).subscribe((res) => {
      this.currentUser!.userStatus.status = res.status;
    });
    
    // Cerrar el menú desplegable
    this.dropdownOpen = false;
  }

  updateMessage(): void {
    if (this.isEditing && this.currentUser) {
      this.isEditing = false;
      const id = this.currentUser!.userStatus.id;
      const userStatus = {
        message: this.currentUser.userStatus?.message,
        status: this.currentUser!.userStatus.status
      };
      
      // Guardar el mensaje en el backend llamando al servicio
      this.userStatusesService.updateUserStatus(id, userStatus)
        .subscribe((res) => {
          this.currentUser!.userStatus.message = res.message;
      });
    }
  }

  onMessageInput(event: Event) {
    const inputElement = event.target as HTMLTextAreaElement;
    if (this.currentUser && this.currentUser.userStatus) {
      this.currentUser.userStatus.message = inputElement.value;
    }
  }

  translateUserStatus(status: UserStatuses): string {
    switch (status) {
      case UserStatuses.ONLINE:
        return 'En Linea';
      case UserStatuses.OFFLINE:
        return 'Desconectado';
      case UserStatuses.AWAY:
        return 'Por Fuera';
      case UserStatuses.BUSY:
        return 'Ocupado';
      default:
        return 'Desconectado';
    }
  }

  onSearch(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();

    // Filtrar los contactos
    this.filteredContacts = this.contacts.filter(contact =>
      contact.contactUser?.names.toLowerCase().includes(searchTerm) ||
      contact.contactUser?.username.toLowerCase().includes(searchTerm)
    );

    // Filtrar los chats recientes
    this.filteredChats = this.chats.filter(chat =>
      chat?.chatMembers?.some(member =>
        member?.user?.names.toLowerCase().includes(searchTerm)
      )
    );

    // Mostrar u ocultar el dropdown de resultados
    this.showSearchResults = searchTerm.length > 0;
  }

  selectChat(chat: IChat) {
    console.log("evento emitido: ", chat);
    this.selectedChat = chat; 
    this.chatCreated.emit(chat);
    this.cdr.detectChanges();
  }

  createChat(contact: IContact): void {
    this.chatService.create()
      .pipe(
        concatMap((chat) => {
          if (!chat) {
            this.sweetAlertService.confirm(
              'question', 'CHAT', 'Error al crear el chat'
            )
            return of(null); 
          }
          this.chat = chat;
          const createMembers = [
            { chatId: chat.id, userId: contact.userId },
            { chatId: chat.id, userId: contact.contactUserId }
          ];

          // Convertimos el array de creación de miembros a una secuencia RxJS
          return of(...createMembers).pipe(
            concatMap((member) => this.chatService.createMembersChat(member))
          );
        })
      )
      .subscribe({
        next: (res) => {
          if (res) {
            // Emitir evento al crear el chat
            if (this.chat){
              this.selectChat(this.chat);
            }
          }
        },
        error: (err) => {
          this.sweetAlertService.confirm(
            'question', 'CHAT', `Error al crear el chat o los miembros: ${err}`
          )
        }
      });
  }
}
