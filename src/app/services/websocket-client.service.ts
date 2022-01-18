import { Injectable } from '@angular/core';
import { filter, first, switchMap } from 'rxjs/operators';
import * as SockJS from 'sockjs-client';
import * as StompJs from 'stompjs';
import { BehaviorSubject, Observable } from 'rxjs';
import { SocketClientState } from '../models/SocketClientState';

@Injectable({
  providedIn: 'root'
})
export class WebsocketClientService {

  private client!: StompJs.Client;
  private state!: BehaviorSubject<SocketClientState>;
  private server: string;
  private token: string;

  constructor() {
    this.server = '';
    this.token = '';
  }

  public setServer(server: string) {
    this.server = server;
  }

  public setToken(token: string) {
    this.token = token;
  }

  public _connection() {
    const socketUrl = `${this.server}?token=${this.token}`;
    this.client = StompJs.over(new SockJS(socketUrl));
    // this.client.debug = (str) => {}; 
    this.state = new BehaviorSubject<SocketClientState>(SocketClientState.ATTEMPTING);
    this.client.connect({}, () => {
      this.state.next(SocketClientState.CONNECTED);
    }, () => this.stompFailureCallBack());
  }

  private stompFailureCallBack() {
    this.connect().pipe(first()).subscribe(inst => inst.disconnect(() => null));
    setTimeout(() => this._connection(), 5000);
    console.warn('Reconnecting in 5 seconds');
  }

  public connect(): Observable<StompJs.Client> {
    return new Observable<StompJs.Client>(observer => {
      this.state.pipe(filter(state => state === SocketClientState.CONNECTED)).subscribe(() => {
        observer.next(this.client);
      })
    })
  }

  public disconnect() {
    this.connect().pipe(first()).subscribe(inst => inst.disconnect(() => { }));
  }

  public onMessage(prefix: string, handle = WebsocketClientService.jsonHandler): Observable<any> {
    return this.connect().pipe(first(), switchMap(client => {
      return new Observable<any>(observer => {
        return client.subscribe(prefix, message => observer.next(handle(message)));
      })
    }))
  }

  public onPlainMessage(prefix: string): Observable<string> {
    return this.onMessage(prefix, WebsocketClientService.textHandler);
  }

  public send(prefix: string, payload: any): void {
    this.connect()
      .pipe(first())
      .subscribe(inst => inst.send(prefix, {}, JSON.stringify(payload)));
  }

  static jsonHandler(message: StompJs.Message): any {
    return JSON.parse(message.body);
  }

  static textHandler(message: StompJs.Message): string {
    return message.body;
  }

}
