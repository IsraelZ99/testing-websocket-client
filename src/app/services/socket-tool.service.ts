import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WebsocketClientService } from './websocket-client.service';

@Injectable({
  providedIn: 'root'
})
export class SocketToolService {

  public constructor(private socketClient: WebsocketClientService) { }

  public retrieveSomething(destination: string): Observable<any> {
    return this.socketClient.onMessage(destination);
  }

  public sendSomething(destination: string, payload: any): void {
    this.socketClient.send(destination, payload);
  }

}
