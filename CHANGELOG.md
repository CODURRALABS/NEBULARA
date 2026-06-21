# Changelog

All notable changes to Nebulara.

## [1.1.0] - 2026-06-21 (FRONTIER PROTOTYPE)

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