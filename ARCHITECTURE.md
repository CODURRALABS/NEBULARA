# Architecture

```
┌─────────────────┐
│   .nbs Source    │
└────────┬────────┘
         │ Tokenizer (C)
         ▼
┌─────────────────┐
│  Tokens Array   │
└────────┬────────┘
         │ Parser (.nbs spec)
         ▼
┌─────────────────┐
│       AST       │
└────────┬────────┘
         │ Codegen (.nbs spec)  
         ▼
┌─────────────────┐
│  Bytecode (13)  │
└────────┬────────┘
         │ Native VM (C)
         ▼
┌─────────────────┐
│ x64 Instructions│
└─────────────────┘
```

## Components

| Layer | Implementation |
|-------|---------------|
| Lexer | `VM/bootstrap.c` |
| Parser | `Compiler/nubaparse.nbs` |
| Codegen | `Compiler/transpiler.nbs` |
| Runtime | `VM/bootstrap.c` |
| FFI | `Lib/*-adapter.c` |

## Bytecode Opcodes

```
0x01 PUSH_INT   - Push integer literal
0x02 ADD        - Add top two values
0x03 SUB        - Subtract
0x04 PRINT      - Print top value
0x05 CALL       - Call function
0x06 RET        - Return
0x07 JUMP       - Unconditional jump
0x08 JUMP_IF    - Conditional jump
0x09 STORE      - Store to environment
0x0A LOAD       - Load from environment
0x0B ALLOC      - Allocate heap memory
0x0C SYSCALL    - System call (exit, write)
```