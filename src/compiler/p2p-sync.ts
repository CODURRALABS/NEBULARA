// P2P Protocol - Shadow Web Implementation
// WebRTC/WebSocket based distributed DATA! synchronization

export interface PeerInfo {
  id: string
  address: string
  lastSeen: number
}

export interface CRDTState {
  key: string
  value: any
  timestamp: number
  nodeId: string
}

export class ShadowWeb {
  private peers: Map<string, PeerInfo> = new Map()
  private crdt: Map<string, CRDTState> = new Map()
  private socket: any = null
  private nodeId: string

  constructor(nodeId?: string) {
    this.nodeId = nodeId || this.generateNodeId()
  }

  private generateNodeId(): string {
    return 'node_' + Math.random().toString(36).substring(2, 10)
  }

  // Initialize P2P network
  async connect(port = 8080): Promise<boolean> {
    try {
      // WebSocket signaling server
      const WebSocket = require('ws')
      this.socket = new WebSocket(`ws://localhost:${port}`)

      this.socket.on('open', () => {
        this.socket?.send(JSON.stringify({ type: 'join', nodeId: this.nodeId }))
      })

      this.socket.on('message', (data: string) => {
        const msg = JSON.parse(data)
        this.handleMessage(msg)
      })

      return true
    } catch {
      // Fallback to peer-to-peer without signaling
      return false
    }
  }

  private handleMessage(msg: any): void {
    switch (msg.type) {
      case 'peer_join':
        this.peers.set(msg.nodeId, {
          id: msg.nodeId,
          address: msg.address,
          lastSeen: Date.now()
        })
        break

      case 'crdt_sync':
        this.mergeCRDT(msg.state)
        break

      case 'data_update':
        this.crdt.set(msg.key, {
          key: msg.key,
          value: msg.value,
          timestamp: msg.timestamp,
          nodeId: msg.nodeId
        })
        break
    }
  }

  // CRDT merge operation
  private mergeCRDT(state: CRDTState[]): void {
    for (const s of state) {
      const existing = this.crdt.get(s.key)
      if (!existing || s.timestamp > existing.timestamp) {
        this.crdt.set(s.key, s)
      }
    }
  }

  // Broadcast DATA! state to peers
  sync(key: string, value: any): void {
    const state: CRDTState = {
      key,
      value,
      timestamp: Date.now(),
      nodeId: this.nodeId
    }

    this.crdt.set(key, state)
    this.socket?.send(JSON.stringify({
      type: 'data_update',
      key,
      value,
      timestamp: state.timestamp,
      nodeId: this.nodeId
    }))
  }

  // Get distributed value
  get(key: string): any {
    return this.crdt.get(key)?.value
  }

  // List connected peers
  getPeers(): PeerInfo[] {
    return Array.from(this.peers.values())
  }

  // Disconnect from network
  disconnect(): void {
    this.socket?.close()
    this.peers.clear()
  }
}

// P2P Node - Individual network participant
export class P2PNode {
  private web: ShadowWeb
  private listeners: Map<string, (data: any) => void> = new Map()

  constructor(nodeId?: string) {
    this.web = new ShadowWeb(nodeId)
  }

  async start(port = 8080): Promise<boolean> {
    return this.web.connect(port)
  }

  on(event: string, callback: (data: any) => void): void {
    this.listeners.set(event, callback)
  }

  // Create a distributed data store
  createStore(name: string): DistributedStore {
    return new DistributedStore(name, this.web, this.nodeId)
  }

  get nodeId(): string {
    return (this.web as any).nodeId
  }
}

// Distributed data store using CRDT
export class DistributedStore {
  private name: string
  private web: ShadowWeb
  private nodeId: string

  constructor(name: string, web: ShadowWeb, nodeId: string) {
    this.name = name
    this.web = web
    this.nodeId = nodeId
  }

  set(key: string, value: any): void {
    this.web.sync(`${this.name}:${key}`, value)
  }

  get(key: string): any {
    return this.web.get(`${this.name}:${key}`)
  }

  list(): string[] {
    return Array.from((this.web as any).crdt.keys())
      .filter((k: string) => k.startsWith(`${this.name}:`))
      .map((k: string) => k.substring(this.name.length + 1))
  }
}