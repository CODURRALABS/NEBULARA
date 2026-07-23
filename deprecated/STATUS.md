# Nebulara Status

**Last Updated**: 2026-07-11  
**See also**: [HONEST_STATUS.md](HONEST_STATUS.md) for detailed assessment

## Summary: Working Prototype

A functional bytecode compiler and VM for the .nbs language. The C runtime (~1,418 lines) is production-quality for what it does. Most advertised features beyond the core VM are not implemented.

## What Works

| Component | Status | File | Lines |
|-----------|--------|------|-------|
| Bytecode compiler | Working | Compiler/nbs_cli.c | 1,418 |
| Stack-based VM | Working | Compiler/nbs_cli.c | (included above) |
| CLI tool | Working | Compiler/nbs_cli.c | (included above) |
| Self-hosted compiler | Partial (buggy) | Compiler/compiler.nbs | 818 |
| JS transpiler emitter | Partial | Compiler/transpiler-js.nbs | 191 |
| Python transpiler emitter | Partial | Compiler/transpiler-py.nbs | 188 |
| AI orchestrator | Partial | nebulara/aurora/orchestrator.nbs | 256 |
| LLM gateway | Partial | nebulara/aurora/gateway.nbs | 127 |
| Event bus | Working | nebulara/aurora/events.nbs | 52 |

## What Does NOT Work

| Component | Status | Notes |
|-----------|--------|-------|
| Native code generation | Not implemented | No x64/x86 machine code output |
| JIT compilation | Demo only | 95 lines, arithmetic only |
| Module/import system | Not implemented | No IMPORT statement |
| Standard library | Stubs | All files call nonexistent builtins |
| FFI | Stubs | python-adapter.c (29 lines) loads DLL, does nothing useful |
| Transpiler integration | Disconnected | Emitters exist but no parser produces expected AST |
| Package manager | Config only | No install/resolve/download logic |
| Frontend | Not implemented | |
| Backend framework | Not implemented | |
| ML/AI | Not implemented | |
| Quantum computing | Not implemented | |
| 3D rendering | Not implemented | |
| Crypto | Not implemented | |

## Opcodes Implemented (70)

Stack: PUSH_INT, PUSH_STR, PUSH_BOOL, PUSH_NULL, POP, DUP, SWAP  
Arithmetic: ADD, SUB, MUL, DIV, MOD, NEG  
Comparison: EQ, NEQ, LT, GT, LTE, GTE  
Logic: AND, OR, NOT  
Bitwise: BITAND, BITOR, LSHIFT, RSHIFT  
Variables: STORE, LOAD  
Control: PRINT, JUMP, JUMP_IFNOT, HALT, EXIT  
Functions: CALL, RET  
Arrays: ARRAY_NEW, ARRAY_GET, ARRAY_SET, ARRAY_LEN, ARRAY_PUSH, ARRAY_POP  
Strings: TOSTR, TONUM, TYPEOF, SUBSTR, CHAR_AT, TO_UPPER, TO_LOWER, STR_EQ, CHAR, ORD  
Math: ABS, MIN, MAX, SQRT, POW, FLOOR, CEIL, ROUND  
File I/O: READ_FILE, WRITE_FILE  
Control flow: BREAK, CONTINUE  
Error handling: TRY, CATCH, THROW, FINALLY, ENDTRY

## Built-in Functions

PRINT, LEN, TYPEOF, TO_STRING, TO_NUMBER, RANDOM, TIME, ABS, ARGUMENT_COUNT, ARGUMENT, CHAR, ORD

## CLI Subcommands

- `nebulara run <file.nbs>` - Execute a .nbs file
- `nebulara build <file.nbs>` - Compile to .nbsc bytecode
- `nebulara repl` - Interactive REPL
- `nebulara highlight <file.nbs>` - Syntax highlighting
- `nebulara version` - Show version
- `nebulara help` - Show help

## Toolchain

- **Compiler**: MinGW-w64 GCC 14.2.0 at `C:\mingw64\`
- **Target**: Windows x64
- **Output**: nebulara.exe (~300KB)

## Known Issues

1. Self-hosted compiler tokenizer bug - `read_word` returns wrong values
2. Memory leaks in array operations (old arrays not freed on concatenation)
3. No garbage collection
4. Standard library files cannot run on current VM (use unsupported syntax)
5. Documentation describes features that do not exist
