Nebulara v1.0
=============

AI-Native Universal Programming Language
-----------------------------------------

**Website:** https://nebulara.dev  
**Source:** https://github.com/codurra/nebulara  
**Issues:** https://github.com/codurra/nebulara/issues  

Nebulara is an AI-native programming language designed for agentic sovereignty.
It features native compilation to ELF64/PE64 binaries without external dependencies.

Features
--------

- **Zero Dependencies** - Pure handwritten lexer/parser, no LLVM or Chevrotain
- **Native Compilation** - Direct to machine code, no NASM required
- **AI-Native Primitives** - Weight logic, spatial vectors, waveform patterns
- **P2P Networking** - Shadow Web distributed computing
- **Self-Hosting** - Compiler written in Nebulara itself

Quick Start
-----------

::

    npm install @codurra/nebulara
    nebulara program.nbs

Directory Structure
-------------------

::

    nebulara/
    ├── Include/          # Type definitions
    ├── Parser/           # Lexer and parser
    ├── Compiler/         # Native compilation
    ├── VM/               # Virtual machine
    ├── Runtime/          # Built-in functions
    ├── Agents/           # AI agents
    ├── Grammar/          # Grammar definition
    ├── Doc/              # Documentation
    ├── Tests/            # Test suite
    └── Tools/            # Developer tools

Install
-------

::

    git clone https://github.com/codurra/nebulara
    cd nebulara
    npm install
    make build

License
-------

MIT License. See LICENSE file for details.