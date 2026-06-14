// CRDT - Conflict-free Replicated Data Types
// For distributed P2P DATA! synchronization

export interface CRDTValue {
  value: any
  timestamp: number
  nodeId: string
  tombstone?: boolean
}

export class LWWRegister<T = any> {
  // Last-Write-Wins Register
  private data: Map<string, CRDTValue> = new Map()

  set(key: string, value: T, timestamp: number, nodeId: string): void {
    const existing = this.data.get(key)
    if (!existing || this.compare(timestamp, nodeId, existing.timestamp, existing.nodeId) > 0) {
      this.data.set(key, { value, timestamp, nodeId })
    }
  }

  get(key: string): T | undefined {
    return this.data.get(key)?.value
  }

  private compare(ts1: number, node1: string, ts2: number, node2: string): number {
    if (ts1 > ts2) return 1
    if (ts1 < ts2) return -1
    return node1.localeCompare(node2)
  }

  toJSON(): object {
    return {
      type: 'LWWRegister',
      data: Array.from(this.data.entries())
    }
  }

  fromJSON(json: any): void {
    this.data = new Map(json.data || [])
  }
}

export class PNCounter {
  // Positive-Negative Counter
  private p: Map<string, number> = new Map() // positive deltas per node
  private n: Map<string, number> = new Map() // negative deltas per node

  increment(nodeId: string, amount = 1): void {
    this.p.set(nodeId, (this.p.get(nodeId) || 0) + amount)
  }

  decrement(nodeId: string, amount = 1): void {
    this.n.set(nodeId, (this.n.get(nodeId) || 0) + amount)
  }

  value(): number {
    let sum = 0
    for (const [_, v] of this.p) sum += v
    for (const [_, v] of this.n) sum -= v
    return sum
  }

  merge(other: PNCounter): void {
    for (const [k, v] of other.p) {
      this.p.set(k, Math.max(this.p.get(k) || 0, v))
    }
    for (const [k, v] of other.n) {
      this.n.set(k, Math.max(this.n.get(k) || 0, v))
    }
  }
}

export class ORSet<T> {
  // Observed-Remove Set
  private addSet: Map<string, Set<T>> = new Map()
  private removeSet: Map<string, Set<T>> = new Map()

  add(item: T, nodeId: string): void {
    if (!this.addSet.has(nodeId)) this.addSet.set(nodeId, new Set())
    this.addSet.get(nodeId)!.add(item)
  }

  remove(item: T, nodeId: string): void {
    if (!this.removeSet.has(nodeId)) this.removeSet.set(nodeId, new Set())
    this.removeSet.get(nodeId)!.add(item)
    // Remove from all add sets
    for (const [node, set] of this.addSet) {
      if (set.has(item)) set.delete(item)
    }
  }

  has(item: T): boolean {
    for (const set of this.addSet.values()) {
      if (set.has(item)) return true
    }
    return false
  }

  values(): T[] {
    const result: T[] = []
    for (const set of this.addSet.values()) {
      for (const item of set) {
        if (!result.includes(item)) result.push(item)
      }
    }
    return result
  }
}

// State container combining CRDT types
export class CRDTContainer {
  private registers: LWWRegister = new LWWRegister()
  private counters: Map<string, PNCounter> = new Map()
  private sets: Map<string, ORSet<any>> = new Map()

  setRegister(key: string, value: any, timestamp: number, nodeId: string): void {
    this.registers.set(key, value, timestamp, nodeId)
  }

  getRegister(key: string): any {
    return this.registers.get(key)
  }

  createCounter(name: string): PNCounter {
    const counter = new PNCounter()
    this.counters.set(name, counter)
    return counter
  }

  getCounter(name: string): PNCounter | undefined {
    return this.counters.get(name)
  }

  createSet(name: string): ORSet<any> {
    const set = new ORSet<any>()
    this.sets.set(name, set)
    return set
  }

  getSet(name: string): ORSet<any> | undefined {
    return this.sets.get(name)
  }

  merge(state: any): void {
    const data = JSON.parse(JSON.stringify(state))
    if (data.registers) {
      this.registers.fromJSON(data.registers)
    }
  }

  snapshot(): any {
    return {
      registers: this.registers.toJSON(),
      counters: {},
      sets: {}
    }
  }
}