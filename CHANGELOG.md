# Changelog

All notable changes to Nebulara.

## [1.0.0] - 2026-06-15

### Added
- Native x64 PE bytecode interpreter
- Self-hosted .nbs to bytecode compiler
- Universal FFI adapters (Node.js, Python, C++)
- Native Vulkan GPU compute bindings
- PE executable generator (no NASM dependency)

### Changed
- Removed TypeScript toolchain
- Removed external dependencies (chevrotain, monaco-editor)
- CPython-style directory structure

### Security
- Added bounds checking for memory access
- Safe array indexing
- Stack overflow protection planned