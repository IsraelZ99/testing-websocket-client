import { AfterContentChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { SocketToolService } from 'src/app/services/socket-tool.service';
import { WebsocketClientService } from 'src/app/services/websocket-client.service';

@Component({
  selector: 'app-testing',
  templateUrl: './testing.component.html',
  styleUrls: ['./testing.component.scss']
})
export class TestingComponent {

  public connectionForm: FormGroup;
  public destinationOnMessagePrefix: FormControl;
  public sendForm: FormGroup;
  public messagesRetrieved: any[];
  public messagesSended: any[];
  public subscriptions: Map<string, Subject<void>>;

  public constructor(private websocketClient: WebsocketClientService, private socketTool: SocketToolService, private cd: ChangeDetectorRef) {
    this.connectionForm = new FormGroup(
      {
        serverUrl: new FormControl('', [Validators.required]),
        token: new FormControl('', [Validators.required])
      }
    );
    this.sendForm = new FormGroup(
      {
        destination: new FormControl('', [Validators.required]),
        payload: new FormControl('', [Validators.required])
      }
    )
    this.destinationOnMessagePrefix = new FormControl('', [Validators.required]);
    this.messagesRetrieved = [];
    this.messagesSended = [];
    this.subscriptions = new Map([]);
  }

  public connectWebsocket() {
    this.websocketClient.setServer(this.connectionForm.value.serverUrl);
    this.websocketClient.setToken(this.connectionForm.value.token);
    this.websocketClient._connection();
  }

  public disconnectToWebsocket() {
    this.websocketClient.disconnect();
  }

  public retrieve(): void {
    this.subscriptions.set(this.destinationOnMessagePrefix.value, new Subject<void>());
    this.socketTool.retrieveSomething(this.destinationOnMessagePrefix.value)
      .pipe(takeUntil(this.subscriptions.get(this.destinationOnMessagePrefix.value) as any))
      .subscribe(something => this.messagesRetrieved.push(something));
    this.cd.detectChanges();
  }

  public send(): void {
    this.socketTool.sendSomething(this.sendForm.value.destination, this.sendForm.value.payload);
  }

  public get getSubscriptions(): string[] {
    return Array.from(this.subscriptions.keys());
  }

  public unsubscribeByDestinationPath(destination: string) {
    const subscription: Subject<void> | undefined = this.subscriptions.get(destination);
    subscription?.next();
    subscription?.complete();
    this.subscriptions.delete(destination);
  }

}
