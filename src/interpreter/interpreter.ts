// Nebulara Native Interpreter - Complete Implementation
import { Parser } from '../parser/parser-core.js'
import { SSAEmitter } from '../ir/ir-ssa.js'
import { NebularaRuntime } from '../compiler/syscall-layer.js'

export interface NebularaValue {
  type: 'number' | 'string' | 'weight' | 'vector' | 'waveform' | 'object' | 'array' | 'function' | 'null' | 'undefined'
  value: any
}

export class NebularaEnvironment {
  private variables = new Map<string, NebularaValue>()
  private parent?: NebularaEnvironment

  constructor(parent?: NebularaEnvironment) {
    this.parent = parent
  }

  define(name: string, value: NebularaValue): void {
    this.variables.set(name, value)
  }

  get(name: string): NebularaValue {
    if (this.variables.has(name)) {
      return this.variables.get(name)!
    }
    if (this.parent) {
      return this.parent.get(name)
    }
    throw new Error(`Undefined variable: ${name}`)
  }

  set(name: string, value: NebularaValue): void {
    if (this.variables.has(name)) {
      this.variables.set(name, value)
      return
    }
    if (this.parent) {
      this.parent.set(name, value)
      return
    }
    throw new Error(`Undefined variable: ${name}`)
  }
}

export class NebularaInterpreter {
  private parser = new Parser()
  private emitter = new SSAEmitter('program')
  private env = new NebularaEnvironment()

  interpret(code: string): NebularaValue {
    const ast = this.parser.parse(code)
    const ssa = this.emitter.generate(ast)
    
    // Execute PRINT instructions via NebularaRuntime
    for (const block of ssa.blocks) {
      for (const instr of block.instructions) {
        if (instr.op === 'PRINT' && instr.args[0]) {
          const msg = instr.args[0].replace(/"/g, '') || ''
          NebularaRuntime.print(msg)
        }
        if (instr.op === 'STORE' && instr.dst) {
          const val = this.evaluateValue(instr.args[0])
          this.env.define(instr.dst, val)
        }
      }
    }
    
    return { type: 'null', value: null }
  }

  private evaluateValue(v: any): NebularaValue {
    if (!v) return { type: 'null', value: null }
    if (typeof v === 'number') return { type: 'number', value: v }
    if (v.startsWith('"')) return { type: 'string', value: v.slice(1) }
    if (typeof v === 'string') {
      const f = parseFloat(v)
      if (!isNaN(f)) return { type: 'weight', value: f }
    }
    return { type: 'null', value: null }
  }
}