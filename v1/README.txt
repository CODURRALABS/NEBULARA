NEBULARA v1.0 - Self-Hosted Native Compiler
===========================================

Build Date: 2026-06-15
Platform: Windows x64
Compiler: GCC/MinGW required

Contents:
- nebulara.exe - Native bytecode compiler
- LICENSE - MIT License
- README.md - Documentation

Usage:
  nebulara.exe source.nbs output.exe

Bytecode Opcodes:
  0x01 PUSH_INT
  0x02 ADD
  0x03 SUB
  0x04 PRINT
  0x0C SYSCALL