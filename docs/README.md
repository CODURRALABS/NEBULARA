# Nebulara Language v3.0

**AI-Native Universal Programming Language** for Agentic Sovereignty

## Quick Start

```bash
npm install @codurra/nebulara
npx nebulara run program.nbs
```

## Features

- **Zero Dependencies** - Native toolchain without LLVM or external tools
- **AI-Native** - Weight-based logic, spatial vectors, waveform patterns
- **Native Compilation** - ELF64/PE64 binaries directly
- **P2P Networking** - Shadow Web distributed computing
- **Self-Hosting** - Compiler written in Nebulara itself

---

## Language Reference

### Identity Markers (`!`)

| Marker | Scope | Description |
|--------|-------|-------------|
| `APP!` | Global | Project/application boundary |
| `AI!` | Cognitive | AI processing block |
| `ENTITY!` | Agent | Persistent living agent |
| `CELL!` | Module | Isolated logic component |
| `DATA!` | Storage | Persistent/sharded data block |
| `RUN!` | Execution | Runtime execution block |
| `FUNC!` | Function | Function definition |
| `LOOP!` | Loop | Infinite loop |
| `IF?` | Conditional | Cognitive branching |
| `WHILE?` | Loop | Intent-driven loop |

### Capability Tags (`@`)

| Tag | Purpose |
|-----|---------|
| `@LOGIC` | High-level reasoning |
| `@EXECUTE` | Low-level execution |
| `@REFLECT` | Recursive validation |
| `@CREATIVE` | Multi-modal generation |
| `@SHADOW` | P2P discovery |
| `@SHARD` | Data sharding control |

### Cognitive Primitives

**Weights (0.0 - 1.0)**
```nebulara
confidence = 0.85!   # High confidence
inquisitive = 0.2?   # Low confidence
```

**Spatial Vectors**
```nebulara
position = V<10, 20, 5>
```

**Waveforms**
```nebulara
signature = ~A4F7B2C1~
```

### Control Flow

```nebulara
APP! "MyApp"

RUN!
  IF? 0.8! >= 0.5 THEN:
    PRINT "High confidence detected"
  ELSE:
    PRINT "Low confidence"
  END!

  LOOP!
    PRINT "Infinite loop"
  END!

  VAR! count = 0
  WHILE? count < 10 THEN:
    PRINT "Count: " + count
    count = count + 1
  END!
END!
END!
```

---

## API Reference

### Main Class

```typescript
import { Nebulara } from '@codurra/nebulara'

const neb = new Nebulara()

// Interpret
neb.interpret('PRINT "Hello"')

// Transpile to target
neb.toJavaScript('PRINT "Hello"')
neb.toPython('PRINT "Hello"')
neb.toCPP('PRINT "Hello"')
neb.toRust('PRINT "Hello"')

// Compile to native binary
const binary = neb.compile('PRINT "Hello"')
```

### VM Execution

```typescript
import { NVM500, CognitiveLogicEngine, AuroraOrchestrator } from '@codurra/nebulara'

// Direct VM execution
const vm = new NVM500()
vm.execute(program)

// Cognitive operations
const engine = new CognitiveLogicEngine()
engine.evaluateWeight(0.8, 'MID')  // true
engine.spatialVector.distance(v1, v2)  // Euclidean distance
```

### P2P Networking

```typescript
import { ShadowWeb, P2PNode } from '@codurra/nebulara'

const node = new P2PNode()
await node.start(8080)

node.on('data', (d) => console.log(d))
```

---

## Architecture

```
Source Code (.nbs)
    ↓
Lexer (296 lines) → Tokens
    ↓
Parser (382 lines) → AST
    ↓
SSA IR (131 lines) → Instructions
    ↓
Native Compiler (118 lines) → x86-64 ASM
    ↓
Binary Emitter (151 lines) → ELF64/PE64
    ↓
Native Execution
```

---

## Performance Targets

| Component | Target | Current |
|-----------|--------|---------|
| Lexer | 50K tokens/ms | ~30K |
| Parser | 20K AST nodes/ms | ~15K |
| VM | 1M instr/sec | ~500K |
| Binary | Direct codegen | NASM step |

---

## License

MIT License - Nebulara Project