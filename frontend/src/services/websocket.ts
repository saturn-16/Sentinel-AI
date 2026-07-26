import { LiveStreamEvent } from '../types';

type Listener = (event: LiveStreamEvent) => void;

class SOCWebSocketClient {
  private socket: WebSocket | null = null;
  private listeners: Listener[] = [];
  private isConnected = false;

  public connect() {
    if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
      return;
    }

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    const wsUrl = `${protocol}//${host}/api/v1/ws`;

    this.socket = new WebSocket(wsUrl);

    this.socket.onopen = () => {
      this.isConnected = true;
    };

    this.socket.onmessage = (event) => {
      try {
        const data: LiveStreamEvent = JSON.parse(event.data);
        this.notifyListeners(data);
      } catch (err) {
      }
    };

    this.socket.onclose = () => {
      this.isConnected = false;
      setTimeout(() => this.connect(), 3000);
    };

    this.socket.onerror = () => {
      this.socket?.close();
    };
  }

  public subscribe(listener: Listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notifyListeners(event: LiveStreamEvent) {
    this.listeners.forEach((listener) => listener(event));
  }

  public getStatus(): boolean {
    return this.isConnected;
  }
}

export const wsClient = new SOCWebSocketClient();
