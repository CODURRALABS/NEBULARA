// NVM-500 Virtual Machine - Nebulara Core Runtime
// Executes SSA IR with full cognitive/spatial/waveform support

import { NebularaRuntime } from '../compiler/syscall-layer.js'

export type VMValue = {
  type: 'number' | 'string' | 'weight' | 'spatial' | 'waveform' | 'null'
  value: any
}

export type CognitiveMode = 'LOW' | 'MID' | 'HIGH'

export class NVM500 {
  private registers = new Map<string, VMValue>()
  private stack: VMValue[] = []
  private pc = 0
  private running = false

  // Trimodal cognitive logic
  evaluateWeight(weight: number, mode: CognitiveMode = 'MID', threshold: number = 0.5): boolean {
    switch (mode) {
      case 'LOW': return weight > threshold * 0.3  // Lower threshold
      case 'MID': return weight > threshold         // Standard 0.5
      case 'HIGH': return weight > threshold * 1.5  // Higher threshold
    }
  }

  // Execute SSA program
  execute(program: { blocks: any[], entry: string }): VMValue {
    this.running = true
    this.pc = 0

    for (const block of program.blocks) {
      for (const instr of block.instructions) {
        this.executeInstruction(instr)
      }
    }

    this.running = false
    return this.registers.get('%result') || { type: 'null', value: null }
  }

  private executeInstruction(instr: any): void {
    switch (instr.op) {
      case 'PRINT':
        const arg = instr.args[0]?.replace(/"/g, '') || ''
        NebularaRuntime.print(arg)
        break

      case 'STORE':
        if (instr.dst && instr.args[0]) {
          this.registers.set(instr.dst, this.parseValue(instr.args[0]))
        }
        break

      case 'BIN':
        const [left, op, right] = instr.args
        const result = this.evaluateBinary(this.parseValue(left), op, this.parseValue(right))
        if (instr.dst) this.registers.set(instr.dst, result)
        break

      case 'WEIGHT_CMP':
        const [w, mode, t] = instr.args
        const cmp = this.evaluateWeight(parseFloat(w), mode as CognitiveMode, parseFloat(t))
        this.registers.set(instr.dst || '%temp', { type: 'number', value: cmp ? 1 : 0 })
        break

      case 'SPATIAL_DIST':
        const [v1, v2] = instr.args.map((a: string) => this.parseSpatial(a))
        const dist = this.spatialDistance(v1, v2)
        this.registers.set(instr.dst || '%temp', { type: 'number', value: dist })
        break
    }
  }

  private parseValue(v: string): VMValue {
    if (!v) return { type: 'null', value: null }
    if (v.startsWith('"')) return { type: 'string', value: v.slice(1, -1) }
    if (v.startsWith('V<')) return this.parseSpatial(v)
    if (v.startsWith('~')) return this.parseWaveform(v)
    const num = parseFloat(v)
    if (!isNaN(num)) return { type: 'weight', value: num }
    return { type: 'number', value: num }
  }

  private parseSpatial(v: string): VMValue {
    const match = v.match(/V<([^,>]+),([^,>]+),([^>]+)>/)
    if (!match) return { type: 'spatial', value: { x: 0, y: 0, z: 0 } }
    return {
      type: 'spatial',
      value: {
        x: parseFloat(match[1]),
        y: parseFloat(match[2]),
        z: parseFloat(match[3])
      }
    }
  }

  private parseWaveform(v: string): VMValue {
    // Parse ~HEXDATA~ format
    const hex = v.slice(1, -1)
    const bytes = hex.match(/../g)?.map(h => parseInt(h, 16)) || []
    return { type: 'waveform', value: bytes }
  }

  private evaluateBinary(left: VMValue, op: string, right: VMValue): VMValue {
    const lv = left.value ?? 0
    const rv = right.value ?? 0

    switch (op) {
      case '+': return { type: 'number', value: lv + rv }
      case '-': return { type: 'number', value: lv - rv }
      case '*': return { type: 'number', value: lv * rv }
      case '/': return { type: 'number', value: lv / rv }
      case '>': return { type: 'number', value: lv > rv ? 1 : 0 }
      case '<': return { type: 'number', value: lv < rv ? 1 : 0 }
      case '==': return { type: 'number', value: lv == rv ? 1 : 0 }
      default: return { type: 'null', value: null }
    }
  }

  private spatialDistance(v1: VMValue, v2: VMValue): number {
    const s1 = v1.value, s2 = v2.value
    return Math.sqrt((s1.x - s2.x)**2 + (s1.y - s2.y)**2 + (s1.z - s2.z)**2)
  }

  push(value: VMValue): void {
    this.stack.push(value)
  }

  pop(): VMValue | undefined {
    return this.stack.pop()
  }

  getRegister(name: string): VMValue | undefined {
    return this.registers.get(name)
  }

  setRegister(name: string, value: VMValue): void {
    this.registers.set(name, value)
  }
}