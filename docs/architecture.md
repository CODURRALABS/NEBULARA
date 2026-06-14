# Nebulara v3.0 Architecture

## Directory Structure

```
src/
├── index.ts                    # Main entry point
├── lexer/
│   ├── lexer-core.ts          # Native lexer (296 lines)
│   └── nebulara-tokens.ts     # Chevrotain legacy (optional)
├── parser/
│   ├── parser-core.ts         # Native parser (382 lines)
│   └── grammar.ts             # Grammar definition
├── ir/
│   └── ir-ssa.ts              # SSA IR generator (131 lines)
├── compiler/
│   ├── native-compiler.ts     # NASM assembly emitter (118 lines)
│   ├── binary-emitter.ts      # ELF64/PE64 binaries (151 lines)
│   ├── syscall-layer.ts       # mmap, network, GPU stubs (112 lines)
│   ├── cognitive-engine.ts    # Trimodal logic (103 lines)
│   ├── spatial-render.ts      # Vector renderer (129 lines)
│   ├── p2p-sync.ts            # Shadow Web networking (122 lines)
│   ├── waveform-dsp.ts        # Audio/pattern DSP (150 lines)
│   ├── crdt-sync.ts           # CRDT distributed state (158 lines)
│   ├── jit-compiler.ts        # Runtime optimization (96 lines)
│   ├── x86-emitter.ts         # x86 codegen helper
│   └── llvm-generator.ts        # Legacy/non-functional (remove)
├── vm/
│   └── nvm-vm.ts              # SSA virtual machine (103 lines)
├── interpreter/
│   └── interpreter.ts         # Native interpreter (59 lines)
├── agents/
│   └── aurora-agents.ts       # AI agent framework (195 lines)
└── transpiler/
    └── transpiler.ts          # Multi-language emitter (233 lines)
```

## Working Files Only

### Core Pipeline (Required)
- `lexer/lexer-core.ts`
- `parser/parser-core.ts`
- `ir/ir-ssa.ts`
- `compiler/native-compiler.ts`
- `compiler/binary-emitter.ts`

### Extended Features (Working)
- `vm/nvm-vm.ts`
- `compiler/cognitive-engine.ts`
- `compiler/spatial-render.ts`
- `compiler/p2p-sync.ts`
- `agents/aurora-agents.ts`
- `compiler/waveform-dsp.ts`
- `compiler/crdt-sync.ts`
- `compiler/jit-compiler.ts`

## Legacy/Unused Files (Remove)
- `compiler/llvm-generator.ts` - Non-functional
- `compiler/compiler-native.ts` - Duplicates native-compiler
- `compiler/emitter-native.ts` - Unclear purpose
- `ir/nir.ts`, `ir/nir-generator.ts` - Unused
- `native.ts` - Legacy
- `runtime/` - Unused
- `syntax/monaco-language.ts` - Unused