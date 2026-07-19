// Comprehensive Test Suite for Nebulara v3.0

import { NebularaLexer, TokenType } from '../lexer/lexer-core.js'
import { Parser } from '../parser/parser-core.js'
import { SSAEmitter } from '../ir/ir-ssa.js'
import { NativeCompiler } from '../compiler/native-compiler.js'
import { BinaryEmitter } from '../compiler/binary-emitter.js'
import { NVM500 } from '../vm/nvm-vm.js'
import { CognitiveLogicEngine } from '../compiler/cognitive-engine.js'
import { SpatialRenderer } from '../compiler/spatial-render.js'
import { AuroraOrchestrator } from '../agents/aurora-agents.js'
import { ShadowWeb } from '../compiler/p2p-sync.js'

describe('Nebulara v3.0 Test Suite', () => {
  describe('Lexer', () => {
    test('tokenizes APP! correctly', () => {
      const lexer = new NebularaLexer('APP! "Test"')
      const tokens = lexer.tokenize()
      expect(tokens[0].type).toBe(TokenType.APP)
    })

    test('tokenizes PRINT correctly', () => {
      const lexer = new NebularaLexer('PRINT "hello"')
      const tokens = lexer.tokenize()
      expect(tokens[0].type).toBe(TokenType.PRINT)
    })

    test('tokenizes IF? correctly', () => {
      const lexer = new NebularaLexer('IF?')
      const tokens = lexer.tokenize()
      expect(tokens[0].type).toBe(TokenType.IF)
    })

    test('tokenizes spatial vectors', () => {
      const lexer = new NebularaLexer('V<1,2,3>')
      const tokens = lexer.tokenize()
      expect(tokens[0].type).toBe(TokenType.SPATIAL)
    })
  })

  describe('Parser', () => {
    test('parses simple program', () => {
      const parser = new Parser()
      const ast = parser.parse('APP! "Test"\nRUN!\n  PRINT "hello"\nEND!\nEND!')
      expect(ast.type).toBe('Program')
      expect(ast.body[0].type).toBe('App')
    })

    test('parses RUN block', () => {
      const parser = new Parser()
      const ast = parser.parse('RUN!\n  PRINT "test"\nEND!')
      expect(ast.body[0].type).toBe('Run')
    })

    test('parses IF? statements', () => {
      const parser = new Parser()
      const ast = parser.parse('IF? true THEN:\n  PRINT "yes"\nEND!')
      expect(ast.body[0].type).toBe('If')
    })
  })

  describe('SSA IR', () => {
    test('generates SSA from AST', () => {
      const emitter = new SSAEmitter('test')
      const ast = { type: 'Program', body: [{ type: 'Run', body: [{ type: 'Print', expression: { type: 'String', value: 'hello' } }] }] }
      const ssa = emitter.generate(ast)
      expect(ssa.blocks.length).toBeGreaterThan(0)
    })

    test('formats SSA to string', () => {
      const emitter = new SSAEmitter('test')
      const ast = { type: 'Program', body: [{ type: 'Print', expression: { type: 'String', value: 'test' } }] }
      const ssa = emitter.generate(ast)
      const ir = emitter.toIR()
      expect(ir).toContain('PRINT')
    })
  })

  describe('Native Compiler', () => {
    test('generates assembly', () => {
      const compiler = new NativeCompiler('linux')
      const asm = compiler.compile('PRINT "test"')
      expect(asm).toContain('BITS 64')
      expect(asm).toContain('_start:')
    })
  })

  describe('Binary Emitter', () => {
    test('creates ELF64 binary', () => {
      const emitter = new BinaryEmitter()
      const ssa = { blocks: [{ label: 'entry', instructions: [{ op: 'PRINT', args: ['"test"'] }] } ], name: 'test', entry: 'entry' }
      const binary = emitter.emit(ssa, { target: 'elf64' })
      expect(binary[0]).toBe(0x7F)
      expect(binary.slice(1, 4).toString()).toBe('ELF')
    })
  })

  describe('NVM-500 VM', () => {
    test('executes PRINT instruction', () => {
      const vm = new NVM500()
      const program = {
        blocks: [{ label: 'entry', instructions: [{ op: 'PRINT', args: ['"vm test"'] }] }],
        entry: 'entry'
      }
      const result = vm.execute(program)
      expect(result).toBeDefined()
    })

    test('evaluates weights in trimodal mode', () => {
      const vm = new NVM500()
      expect(vm.evaluateWeight(0.8, 'LOW')).toBe(true)
      expect(vm.evaluateWeight(0.8, 'HIGH')).toBe(false)
      expect(vm.evaluateWeight(0.8, 'MID')).toBe(true)
    })
  })

  describe('Cognitive Logic Engine', () => {
    test('evaluates weights', () => {
      const engine = new CognitiveLogicEngine()
      expect(engine.evaluateWeight(0.8, 'MID')).toBe(true)
      expect(engine.evaluateWeight(0.2, 'MID')).toBe(false)
    })

    test('computes spatial distance', () => {
      const engine = new CognitiveLogicEngine()
      const d = engine.spatialVector.distance({ x: 0, y: 0, z: 0 }, { x: 3, y: 4, z: 0 })
      expect(d).toBe(5)
    })
  })

  describe('Spatial Renderer', () => {
    test('parses spatial vectors', () => {
      const renderer = new SpatialRenderer()
      const v = renderer.parseVector('V<1,2,3>')
      expect(v?.x).toBe(1)
      expect(v?.y).toBe(2)
      expect(v?.z).toBe(3)
    })
  })

  describe('Aurora Agents', () => {
    test('CODESMITH generates code', () => {
      const orchestrator = new AuroraOrchestrator()
      const result = orchestrator.execute('CODESMITH', { intent: 'print hello' })
      expect(result.success).toBe(true)
    })
  })
})

export {}