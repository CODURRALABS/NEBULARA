# Changelog

All notable changes to Nebulara.

## [1.3.0] - 2026-10-01

### Added - v4 Language Features in v3 Pipeline
- **Float literals** (`3.14`, `2.5e-3`, `1.5E10`) with JS/Python transpilation
- **Map literals** (`{"key": value, "age": 30}`) with JS/Python transpilation  
- **META blocks** for provenance metadata (`META author:"x", risk:LOW`)
- **USE module system** (`USE "mathx"` with namespace)
- Lexer: `TOK_FLOAT_LIT`, `TOK_LBRACE`, `TOK_RBRACE`, `TOK_META`, `TOK_USE`
- AST: `NODE_FLOAT`, `NODE_MAP_LIT`, `NODE_META`, `NODE_USE`
- Parser: float literals, map literals, META blocks, USE statements
- Semantic analysis: all new node types
- JS transpiler: float, map, META, USE
- Python transpiler: float, map, META, USE

### Fixed
- VM CONTINUE bug in FOR loops (removed spurious jump to loop condition)
- IMPORT semantic analysis (loads/analyzes imported files)
- Array literal transpilation to JS/Python
- Concurrency builtins in semantic analysis (`CHAN!`, `MUTEX!`, `LOCK!`, `UNLOCK!`, `YIELD!`, `SLEEP!`)
- All compiler warnings cleaned up (neb-pipeline.exe, neb-cli.exe, neb-codegen.exe)

### Documentation
- Added PRIMORDIA specs: 11 docs (01-CONCEPT through 11-FAQ)
- Added v4 conformance tests: 8 new test files
- Updated SPEC.md to v4.0 with Float, Map, META, USE
- Updated README.md with v1.3.0 badge and v4 feature examples

### Copied from PRIMORDIA
- Full PRIMORDIA specification docs (11 files)
- Nebulara v4 conformance examples: `01_hello.nbs` through `06_use.nbs`
- `test_float.nbs`, `mathx.nbs`, `lib_mathx.nbs`

### Build
- All targets build clean: `neb-pipeline.exe`, `neb-cli.exe`, `neb-codegen.exe`
- Makefile portability: OS-conditional CFLAGS, DYNLIBS=-lm

## [1.2.0] - 2026-06-21 (FRONTIER PROTOTYPE)

### Added
- Native x86 JIT runtime (`nbs_native.exe`, `nbs_x64.c`)
- Live HTTP fetching (verified with example.com)
- 1029-node knowledge graph (67 core + 933 learned + 29 HTTP)
- Recursive learning engine (3-level depth)
- Vector similarity search (cosine similarity)
- Quantization system (4/8/16/32-bit compression)
- Benchmark suite for performance testing
- GPU/CUDA/Vulkan interface stubs

### Working Features
- Expression compilation: `10 + 5 = 15`
- Multiplication: `3 * 4 = 12`
- Subtraction: `20 - 7 = 13`
- Module loading (`.nbs` files)
- Knowledge expansion from HTTP sources

### Limitations
- x64 JIT: Requires x64 toolchain (current is i686)
- Redis: In-memory simulation
- ONNX: Not integrated
- GPU: Stubs only, no bindings

## [1.0.0] - 2026-06-15

### Added
- Native x64 PE bytecode interpreter (conceptual)
- Self-hosted .nbs to bytecode compiler (planned)
- Universal FFI adapters (Node.js, Python, C++) (planned)
- PE executable generator (planned)

### Security
- Bounds checking for memory access (32-bit JIT)
- Safe array indexing
- Stack overflow protection planned