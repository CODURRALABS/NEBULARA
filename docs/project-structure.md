# Nebulara Project Structure

```
nebulara/
├── nebulara/Runtime/           # Native runtime (C)
│   ├── nbs_loader.c           # Module loader - compiles to nbs_loader.exe
│   ├── nbs_native.c           # Native JIT runtime - compiles to nbs_native.exe
│   ├── nbs_x64.c              # x64 JIT source (incomplete)
│   └── VM/                    # Virtual machine
├── nebulara/Compiler/          # Compiler components
├── nebulara/Lib/               # Standard library (.nbs files)
│   ├── io.nbs
│   ├── math.nbs
│   └── ai.nbs
├── void/                       # Void-specific modules
│   ├── core.nbs
│   ├── stdlib.nbs
│   ├── evolution.mjs
│   └── engine_frontier.nbs
├── void_frontier.mjs           # Complete JS frontier engine
├── nbs_native.exe              # Compiled native JIT (working)
├── nbs_loader.exe              # Compiled loader (working)
├── nebulara/ARCHITECTURE.md    # Architecture documentation
├── nebulara/CHANGELOG.md       # Change log
└── nebulara/README.md          # Project readme
```

## Working Executables (2026-06-21)

| File | Size | Status | Function |
|------|------|--------|----------|
| nbs_native.exe | 59KB | ✅ | Native JIT runtime |
| nbs_loader.exe | 60KB | ✅ | Module loader |
| nbs_x64.exe | 59KB | ⚠️ | x64 JIT (won't execute) |

## Toolchain

MinGW-w64 i686 installed:
- Compiler: `C:\mingw-w64\mingw32\bin\gcc.exe`
- Target: 32-bit x86 (cannot generate x64 opcodes)
- Needed: x86_64 MinGW or Clang with headers

## Self-Hosting Status

1. `Grammar/nebulara.gram` - Planned
2. `Compiler/binary-emitter.nbs` - Planned
3. `Runtime/builtins.nbs` - In progress
4. Native compilation - Working (C source)
5. Self-tests - Planned