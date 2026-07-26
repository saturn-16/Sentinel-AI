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

    let wsUrl = '';
    const rawUrl = (import.meta as any).env?.VITE_API_URL || '';
    if (rawUrl) {
      const cleanUrl = rawUrl.endsWith('/') ? rawUrl.slice(0, -1) : rawUrl;
      const wsProtocol = cleanUrl.startsWith('https') ? 'wss:' : 'ws:';
      const hostPath = cleanUrl.replace(/^https?:\/\//, '');
      wsUrl = `${wsProtocol}//${hostPath}/api/v1/ws`;
    } else {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const hostname = window.location.hostname || 'localhost';
      const port = window.location.port === '3000' ? '8000' : window.location.port;
      const portStr = port ? `:${port}` : '';
      wsUrl = `${protocol}//${hostname}${portStr}/api/v1/ws`;
    }

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
