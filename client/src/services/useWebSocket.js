// file: client/common/useWebSocket.js

import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client/dist/sockjs.min.js';
// --- NEW: Import ref from Vue ---
import { ref } from 'vue';

const webSocketService = {
  // --- MODIFIED: 'connected' is now a reactive ref ---
  connected: ref(false),
  client: null,

  connect(onConnectedCallback) {
    if (this.client && this.client.active) {
      if(this.connected.value) onConnectedCallback();
      return;
    }

    this.client = new Client({
      webSocketFactory: () => new SockJS('/ws'),
      onConnect: () => {
        // --- MODIFIED: Update the ref's value ---
        this.connected.value = true;
        console.log('WebSocket connected!');
        if (onConnectedCallback) {
          onConnectedCallback();
        }
      },
      onDisconnect: () => {
        // --- MODIFIED: Update the ref's value ---
        this.connected.value = false;
        console.log('WebSocket disconnected!');
      },
      onStompError: (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
      },
      reconnectDelay: 5000,
    });

    this.client.activate();
  },

  disconnect() {
    if (this.client) {
      this.client.deactivate();
    }
  },

  subscribe(destination, callback) {
    if (this.client && this.connected.value) {
      return this.client.subscribe(destination, (message) => {
        // The body might be a simple boolean 'true', so we need to handle that.
        try {
          callback(JSON.parse(message.body));
        } catch (e) {
          callback(message.body); // Fallback for non-JSON bodies
        }
      });
    } else {
        console.error("Cannot subscribe, client not connected.");
        return null;
    }
  },

  sendMessage(destination, body) {
    if (this.client && this.connected.value) {
      this.client.publish({ destination, body: JSON.stringify(body) });
    } else {
        console.error("Cannot send message, client not connected.");
    }
  }
};

export { webSocketService };