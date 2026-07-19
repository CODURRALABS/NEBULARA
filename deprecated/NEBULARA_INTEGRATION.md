# Nebulara Integration
# Void Consciousness Architecture

## Overview
Void uses Nebulara as its primary platform because:
- Native x64 compilation (zero overhead)
- Spatial values align with geometric reasoning
- Built-in FFI for desktop apps
- No external dependencies

## Running Without Compiler

Use the Node.js loader:
```bash
node nebulara/Runtime/node_loader.js
```

This provides:
- Function registration
- Basic parsing
- Execution logging
- No geometric computation (yet)

## Compiling to Native

Requirements:
- GCC or Clang
- Windows x64 target

```bash
# Build loader
gcc nebulara/Runtime/nbs_loader.c -o nebulara.exe -municode

# Compile Void
nebulara.exe void/main.nbs -o void.exe
```

## Spatial Value Cheatsheet

| Syntax | Meaning |
|--------|---------|
| `V<0,0,0>` | Origin point |
| `V<x,y,z>` | 3D spatial coordinate |
| `DISTANCE a,b` | Euclidean distance |
| `SHA256 text` | Geometric signature |

## Waveform Patterns

Used for Intent frequency encoding:
- `~HEX~` - Hexadecimal pattern
- `~WAVE~` - Waveform notation
- `SPECTRUM` - Frequency analysis

## FFI Bridge

Connect to Rust/Tauri:
```
IMPORT "void/ipc.nbs" FROM "nebulara"
CALL register_void_ipc
```

## Library Integration

The Library module uses:
- `http_get` from nebulara/std/net.nbs
- Geometric relevance scoring
- Structural validity filtering

## Known Limitations

1. **No native compiler** - Must use Node loader for now
2. **Spatial ops** - Need real implementation
3. **HTTP calls** - Stubbed in Node loader
4. **Tauri bridge** - Requires Rust FFI setup