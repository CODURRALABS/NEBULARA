# Nebulara Project Structure (CPython-style)

```
nebulara/
├── src/
│   ├── nebulara.ts           # Main entry point
│   ├── Include/               # Type definitions
│   │   └── nebulara.d.ts
│   ├── Parser/                # Parser implementation
│   │   ├── lexer-core.ts
│   │   ├── parser-core.ts
│   │   └── grammar.nbs
│   ├── IR/                    # Intermediate Representation
│   │   └── ir-ssa.ts
│   ├── Compiler/              # Native compilation
│   │   ├── native-compiler.ts  # NASM emitter
│   │   ├── binary-emitter.ts   # ELF64/PE64 binaries
│   │   └── x86-encoder.ts      # Raw machine code
│   ├── VM/                    # Virtual machine
│   │   └── nvm-vm.ts
│   ├── Runtime/               # Runtime library
│   │   ├── builtins.nbs        # Built-in functions
│   │   └── cognitive.nbs       # Cognitive primitives
│   ├── Agents/                # AI agents
│   │   └── aurora-agents.ts
│   ├── Transpiler/            # Target language emitters
│   │   └── transpiler.ts
│   └── Lib/                   # Nebulara standard library (.nbs files)
│       ├── io.nbs
│       ├── math.nbs
│       └── ai.nbs
├── Grammar/                   # Grammar specification
│   └── nebulara.gram
├── Doc/                       # Documentation
│   ├── reference.md
│   └── tutorial.md
├── Tests/                     # Test suite
│   ├── test_lexer.nbs
│   ├── test_parser.nbs
│   └── test_vm.nbs
├── Tools/                     # Developer tools
│   ├── format.nbs
│   └── lint.nbs
├── configure.sh               # Build configuration
├── Makefile                   # Build targets
└── README.md                  # This file
```

## Self-Hosting Path

1. `Grammar/nebulara.gram` - Formal grammar in Nebulara syntax
2. `Parser/grammar.nbs` - Nebulara-written parser
3. `Compiler/binary-emitter.nbs` - Nebulara-written binary emitter
4. `Runtime/builtins.nbs` - Core functions in Nebulara
5. `Tests/*.nbs` - Language self-tests

When complete, `nebulara.nbs` → `nebulara.o` → native execution