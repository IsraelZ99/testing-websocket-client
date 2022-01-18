# TestingWebsocket

This project is about websocket connection and is a tool to test it.

## Dependencies installed
* net
* @stomp/ng2-stompjs
* @stomp/stompjs
* @types/sockjs-client
* @types/stompjs
* socket.io
* socket.io-client
* sockjs
* sockjs-client
* stompjs

## Configuration
1. In the polyfills.ts at the bottom add:
    `(window as any).global = window;`

## Use
1. Run project with: ng serve.
2. Add your server url and token.
3. Press **connect** button.
### To subscribe:
* Add destination prefix.
* Click on **Subscribe** button.
### To unsubscribe from something:
* Click on **Unsubscribe** button.
### To send something:
* Add destination prefix.
* Add payload.
* Click on **Send** button.
### To disconnect from websocket:
* Click on **Disconnect** button

