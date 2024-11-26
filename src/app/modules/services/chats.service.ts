import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { SweetAlertService } from '../../shared/utils/sweet-alert.service';
import { environments } from '../../../environments/environments';


interface Client {
  room: string
}

interface Payload {
  notification:  {
    title:  string
    body:   string
  }
}

@Injectable({
  providedIn: 'root'
})
export class ChatsService extends Socket {

  constructor(
    private sweetAlertService: SweetAlertService
  ) { 
    super({ 
      url: environments.pushNotificationSocketUrl, 
      options: { transports: ['websocket'] } 
    });

    this.onNotification();
  }

  sendClient(data: Client) {
    this.ioSocket.emit('join', data);
  }

  onNotification() {
    this.ioSocket.on('onNotification', (payload: Payload) => {
      this.sweetAlertService.toast('success', `${ payload.notification.title }`, `${ payload.notification.body }`);
    });
  }

}
