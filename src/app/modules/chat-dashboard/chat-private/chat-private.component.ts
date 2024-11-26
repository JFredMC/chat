import { Component, Input } from '@angular/core';
import { IChat } from '../../../models/models.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat-private',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chat-private.component.html',
  styleUrl: './chat-private.component.scss'
})
export class ChatPrivateComponent {
  @Input() selectedChat!: IChat;
  
  chatVisible: boolean = false;

  onChatCreated(chat: IChat) {
    console.log('evento escuchado private', chat);
    this.selectedChat = chat;  // Actualizar el chat seleccionado
    this.chatVisible = true;  // Mostrar el chat en la vista
    this.loadChatMessages(chat);  // Cargar mensajes del chat
  }

  // Método para cargar los mensajes del chat seleccionado
  loadChatMessages(chat: IChat) {
    // Lógica para cargar los mensajes del chat seleccionado
  }
}
