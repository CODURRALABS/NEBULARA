# Architecture

```
┌─────────────────────────────────────────────┐
│              VOID FRONTIER ENGINE             │
└────────────────────────┬────────────────────┘
                         │
    ┌────────────────────┼────────────────────┐
    │                    │                    │
    ▼                    ▼                    ▼
┌──────────┐      ┌───────────┐       ┌────────────┐
│  Native  │      │    JS     │       │   HTTP     │
│   JIT    │      │  Engine   │       │  Fetch     │
│ (x86)    │      │           │       │            │
└──────────┘      └───────────┘       └────────────┘
    │                    │                    │
    │ .nbs Source ───────┼──────────────────────┤
    │ Tokenize ──────────┼──────────────────────┤
    │ Parse ─────────────┼──────────────────────┤
    │ Exec ──────────────┘                    │
    │                                        │
    ▼
┌─────────────────────────────────────────────┐
│         x64/SSE/AVX INSTRUCTIONS           │
│  (via JIT compilation)                     │
└─────────────────────────────────────────────┘
```

## Implemented Components

| Layer | Implementation | Status | Nodes |
|-------|---------------|--------|-------|
| Lexer | `VM/bootstrap.c` | ✅ | - |
| Parser | `Compiler/nubaparse.nbs` | ✅ | - |
| JIT | `VM/nbs_x64.c` | ⚠️ 32-bit | - |
| Runtime | `Runtime/nbs_native.c` | ✅ | - |
| Knowledge | `void_frontier.mjs` | ✅ | 1029+ |
| HTTP | Built-in | ✅ | Live |
| Vector DB | In-memory | ✅ | Simulated |

## Bytecode Opcodes (13)

```
0x01 PUSH_INT   - Push integer literal
0x02 ADD        - Add top two values  
0x03 SUB        - Subtract
0x04 MUL        - Multiply
0x05 PRINT      - Print top value
0x06 CALL       - Call function
0x07 RET        - Return
0x08 JUMP       - Unconditional jump
0x09 JUMP_IF    - Conditional jump
0x0A STORE      - Store to environment
0x0B LOAD       - Load from environment
0x0C ALLOC      - Allocate heap memory
0x0D SYSCALL    - System call (exit, write)
```

## Capabilities

### Native Execution
- `nbs_native.exe` - x86 JIT runtime
- HTTP verified with example.com (status 200)
- 1029 knowledge nodes loaded

### Frontier Features
- Recursive learning engine
- Vector similarity search
- Quantization (4/8/16/32-bit)
- Benchmark suite
- GPU stubs (CUDA/Vulkan ready)

## Limitations

| Feature | Status | Notes |
|---------|--------|-------|
| x64 JIT | ⚠️ Blocked | Need x64 MinGW/Clang |
| Redis | ❌ Missing | In-memory Map simulation |
| ONNX | ❌ Missing | No neural inference |
| GPU | ❌ Stubs | No CUDA/Vulkan bindings |

## Running

```powershell
# Native JIT
.\nbs_native.exe "10 + 5"

# JS Frontier
node void_frontier.mjs

# Module loading
.\nbs_native.exe "void\core.nbs"
```