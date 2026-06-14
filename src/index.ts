// Nebulara Language - Complete API Entry Point
// Zero-dependency native compiler with full AI-native features

import { NebularaLexer, TokenType, Token } from './lexer/lexer-core.js'
import { Parser, ASTNode } from './parser/parser-core.js'
import { SSAEmitter, SSAProgram } from './ir/ir-ssa.js'
import { NativeCompiler } from './compiler/native-compiler.js'
import { BinaryEmitter, BinaryOptions } from './compiler/binary-emitter.js'
import { NebularaInterpreter, NebularaEnvironment, NebularaValue } from './interpreter/interpreter.js'
import { NebularaTranspiler, TargetLanguage, TranspilerOptions } from './transpiler/transpiler.js'
import { SyscallLayer, SyscallResult, MmapWrapper, NebularaRuntime } from './compiler/syscall-layer.js'
import { NVM500, VMValue, CognitiveMode } from './vm/nvm-vm.js'
import { CognitiveLogicEngine } from './compiler/cognitive-engine.js'
import { SpatialRenderer, SpatialVector3D, Camera } from './compiler/spatial-render.js'
import { AuroraOrchestrator, AuroraAgent, AgentContext, AgentResult } from './agents/aurora-agents.js'
import { ShadowWeb, P2PNode, DistributedStore } from './compiler/p2p-sync.js'
import { WaveformDSP, Waveform } from './compiler/waveform-dsp.js'
import { CRDTContainer, LWWRegister, PNCounter, ORSet } from './compiler/crdt-sync.js'
import { JITCompiler, InlineCache, JITBlock, SSAInstruction } from './compiler/jit-compiler.js'

export {
  NebularaLexer, TokenType, Token,
  Parser, ASTNode,
  SSAEmitter, SSAProgram,
  NativeCompiler,
  BinaryEmitter, BinaryOptions,
  NebularaInterpreter, NebularaEnvironment, NebularaValue,
  NebularaTranspiler, TargetLanguage, TranspilerOptions,
  SyscallLayer, SyscallResult, MmapWrapper, NebularaRuntime,
  NVM500, VMValue, CognitiveMode,
  CognitiveLogicEngine,
  SpatialRenderer, SpatialVector3D, Camera,
  AuroraOrchestrator, AuroraAgent, AgentContext, AgentResult,
  ShadowWeb, P2PNode, DistributedStore,
  WaveformDSP, Waveform,
  CRDTContainer, LWWRegister, PNCounter, ORSet,
  JITCompiler, InlineCache, JITBlock, SSAInstruction
}

export class Nebulara {
  private parser = new Parser()
  private emitter = new SSAEmitter('program')
  private compiler = new NativeCompiler('linux')
  private vm = new NVM500()
  private engine = new CognitiveLogicEngine()
  private aurora = new AuroraOrchestrator()

  interpret(code: string): NebularaValue {
    return new NebularaInterpreter().interpret(code)
  }

  transpile(code: string, target: TargetLanguage = 'asm'): string {
    return new NebularaTranspiler().transpile(code, { target })
  }

  toJavaScript(code: string): string { return this.transpile(code, 'javascript') }
  toPython(code: string): string { return this.transpile(code, 'python') }
  toCPP(code: string): string { return this.transpile(code, 'cpp') }
  toCSharp(code: string): string { return this.transpile(code, 'csharp') }
  toRust(code: string): string { return this.transpile(code, 'rust') }
  toWASM(code: string): string { return this.transpile(code, 'wasm') }
  toCSS(code: string): string { return this.transpile(code, 'css') }
  toHTML(code: string): string { return this.transpile(code, 'html') }
  toJSON(code: string): string { return this.transpile(code, 'json') }
  toAssembly(code: string): string { return this.transpile(code, 'asm') }

  compile(code: string): Buffer {
    const binary = new BinaryEmitter()
    const ast = this.parser.parse(code)
    const ssa = this.emitter.generate(ast)
    return binary.emit({ blocks: ssa.blocks, name: 'program', entry: 'entry' }, { target: 'elf64' })
  }

  getIR(code: string): string {
    const ast = this.parser.parse(code)
    const ssa = this.emitter.generate(ast)
    return this.emitter.toIR()
  }

  getAssembly(code: string): string {
    return this.compiler.compile(code)
  }

  executeVM(code: string): VMValue {
    const ast = this.parser.parse(code)
    const ssa = this.emitter.generate(ast)
    return this.vm.execute(ssa)
  }

  evaluateWeight(value: number, mode: 'LOW' | 'MID' | 'HIGH' = 'MID'): boolean {
    return this.engine.evaluateWeight(value, mode)
  }

  executeAgent(agent: string, context: AgentContext): AgentResult {
    return this.aurora.execute(agent, context)
  }

  listAgents(): string[] {
    return this.aurora.list()
  }

  async createP2PNode(port?: number): Promise<P2PNode> {
    const node = new P2PNode()
    await node.start(port)
    return node
  }
}

export default Nebulara