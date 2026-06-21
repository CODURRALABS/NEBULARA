# Nebulara

**Nebulara - The AI-Native Universal Programming Language**

A native compiler that generates machine code with zero external dependencies.

[![License: Proprietary](https://img.shields.io/badge/License-Proprietary-red.svg)]()
[![Status: Frontier Prototype](https://img.shields.io/badge/Status-Prototype-yellow.svg)]()

## Quick Start

```powershell
# Run native JIT (32-bit x86)
.\nbs_native.exe "10 + 5"

# Run JS frontier engine
node void_frontier.mjs

# Load .nbs module
.\nbs_native.exe "void\core.nbs"
```

## Current Capabilities (2026-06-21)

| Feature | Status | Notes |
|---------|--------|-------|
| Native JIT | ✅ Working | x86 opcodes, 32-bit |
| HTTP Fetch | ✅ Working | Live verified (status 200) |
| Knowledge Graph | ✅ 1029 nodes | Learned + static |
| Recursive Learning | ✅ Implemented | 3-level depth |
| Vector Search | ✅ In-memory | Cosine similarity |
| Quantization | ✅ Working | 4/8/16/32-bit |

## Files

- `nebulara/Runtime/nbs_native.c` - Native JIT source
- `nebulara/Runtime/nbs_x64.c` - x64 JIT source (incomplete)
- `void_frontier.mjs` - Complete JS engine
- `void/stdlib.nbs` - Standard library
- `void/core.nbs` - Core modules

## Limitations

| Feature | Status | Notes |
|---------|--------|-------|
| x64 JIT | ⚠️ Blocked | Need x64 toolchain |
| GPU Compute | ❌ Stubs | No CUDA/Vulkan |
| Redis | ❌ Missing | In-memory simulation |
| ONNX | ❌ Missing | No neural inference |

## Toolchain (Current)

MinGW-w64 i686 installed at `C:\mingw-w64\mingw32\`
- `gcc.exe` - Compiles to 32-bit executables
- `clang.exe` - Available but needs headers for x64

## License

Proprietary - CODURRA Labs & Technologies