import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';
import { IUser } from '../../auth/interfaces/interface.interface';
import { IChat } from '../../../models/models.model';
import { catchError, first, of, Subscription } from 'rxjs';
import { ChatService } from '../../services/chat.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recent-chats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recent-chats.component.html',
  styleUrl: './recent-chats.component.scss'
})
export class RecentChatsComponent implements OnInit {
  @Input() selectedChat!: IChat;
  public currentUser?: IUser | null = null;
  searchTerm = '';
  newMessage = '';
  
  chats: IChat[] = [];
  private subscriptions: Subscription[] = [];
  constructor(
    private authService: AuthService,
    private chatService: ChatService,
  ) {}

  ngOnInit(): void {
    this.authService.loading(true);
    this.authService.currentUserSub$.subscribe(user => {
      this.currentUser = user!;
      this.loadData();
    });

    this.authService.loading(false);
  }

  get filteredChats() {
    return this.chats.filter(chat =>
      chat.chatMembers?.some(member => 
        member?.user?.names.toLowerCase().includes(this.searchTerm.toLowerCase())
      )
    );
  }

  loadData() {
    const sb1 = this.
      chatService.getAll()
      .pipe(
        first(),
        catchError((errorMessage) => {
          return of(this.chats);
        })
      )
      .subscribe(async (resp) => {
        console.log('chats: ', resp);
        this.chats = resp;
      });
    this.subscriptions.push(sb1);
  }

  selectChat(chat: IChat) {
    this.selectedChat = chat;
    // In a real application, you would load messages for the selected chat here
  }
}
