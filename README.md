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
    (window as any).global = window;