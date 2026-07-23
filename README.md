# Nebulara

<p align="center">
  <img src="logo.png" alt="Nebulara Logo" width="140"/>
</p>

**The AI-Native Universal Programming Language**


A complete C-based toolchain: interpreter, CLI, transpiler (JS/Python), semantic analyzer, FFI bridge, native codegen, and knowledge graph. Install via npm with zero dependencies.

[![npm](https://img.shields.io/badge/npm-nebulara@2.0.0-blue.svg)](https://www.npmjs.com/package/nebulara)
[![License: Proprietary](https://img.shields.io/badge/License-Proprietary-red.svg)]()
[![Status: Active](https://img.shields.io/badge/Status-Active-brightgreen.svg)]()

## Install

```bash
npm install -g nebulara
```

## Quick Start

```bash
# Run a .nbs file
neb run hello.nbs

# Transpile to JavaScript
neb transpile hello.nbs --target js

# Transpile to Python
neb transpile hello.nbs --target py

# Type check
neb check hello.nbs

# Run REPL
neb repl
```

## Language Syntax

```
# Variables
LET name = "Nebulara"
LET count = 42
LET arr = [10, 20, 30]
arr[1] = 99                  # Array mutation
PUSH(arr, 40)                # Append
LET last = POP(arr)          # Remove last

# Arithmetic
LET result = 10 + 5 * 2 - 3 / 1

# Strings
LET greeting = "Hello, " + name
PRINT(TO_UPPER(greeting))
PRINT(LEN(greeting))
PRINT(CHAR_AT(greeting, 0))
PRINT(SUBSTR(greeting, 0, 5))

# Bitwise operators
PRINT(5 & 3)        # 1 (AND)
PRINT(5 | 3)        # 7 (OR)
PRINT(1 << 3)       # 8
PRINT(16 >> 2)      # 4

# Control flow
IF? count > 10 THEN:
    PRINT("big")
ELSEIF? count > 5 THEN:
    PRINT("medium")
ELSE:
    PRINT("small")
END!

# Loops
WHILE? count > 0 THEN:
    count = count - 1
END!

FOR! i = 0 TO 10 (STEP 2):
    PRINT(i)
END!

# Functions
FUNC! add(a, b):
    RETURN a + b
END!

# Exception handling
TRY:
    THROW "something went wrong"
CATCH err:
    PRINT("Caught: " + err)
END!

# Math builtins
PRINT(ABS(-42))     # 42
PRINT(SQRT(16))     # 4
PRINT(POW(2, 10))   # 1024
PRINT(CHAR(65))     # A
PRINT(ORD("Z"))     # 90
```

## What's in the box

| Component | What it does |
|-----------|-------------|
| **Interpreter** (`nebulara.exe`) | Full AST, bytecode VM, 40+ opcodes, 35+ builtins |
| **CLI** (`neb-cli.exe`) | REPL, .nbsc bytecode compilation, syntax highlighting |
| **Pipeline** (`neb-pipeline.exe`) | `.nbs` -> JavaScript / Python transpilation |
| **Semantic Analyzer** | Scope-based type checking, undefined variable detection |
| **FFI Bridge** (`neb-ffi.exe`) | Call C functions via dlopen/LoadLibrary (tested: msvcrt.abs(-42)=42) |
| **Native Codegen** (`neb-codegen.exe`) | x86/x64 instruction encoder |
| **Knowledge Graph** (`neb-knowledge.exe`) | Entity/relation tracking for AI-native features |

## Programmatic API

```javascript
const { run, runString, transpileToJS, transpileToPython, check } = require('nebulara');

run('./hello.nbs');
runString('PRINT("Hello!")');
transpileToJS('./app.nbs');      // Returns JavaScript source
transpileToPython('./app.nbs');  // Returns Python source
check('./app.nbs');              // Type checking
```

## Standard Library

| Module | Functions |
|--------|-----------|
| `primitives.nbs` | IS_INT, IS_STRING, IS_BOOL, IS_NULL, IS_ARRAY, IS_FUNC, IS_NUMBER |
| `math.nbs` | abs, min, max, clamp, sum_array, average |
| `string.nbs` | concat, repeat, reverse, contains, to_upper, to_lower, trim, substring |
| `collections.nbs` | find, contains, reverse_array, sum_array, max_array, min_array |
| `json.nbs` | json_stringify (json_parse stub - needs FFI) |
| `net.nbs` | All stubs (needs FFI to libcurl/WinHTTP) |
| `time.nbs` | now, elapsed, sleep (needs FFI) |

## Tests

```bash
node scripts/test.js    # 7/7 passing
```

## Language Comparison

See [COMPARISON.md](COMPARISON.md) for detailed comparison with Python, JavaScript, Go, Rust, C, and other languages.

## Architecture

```
Source (.nbs)
    |
    v
  Lexer  ---> Tokens
    |
    v
  Parser ---> AST
    |
    +---> Semantic Analyzer (type checking)
    |
    +---> Bytecode Compiler ---> VM (interpret)
    |
    +---> JS Transpiler ---> JavaScript
    |
    +---> Python Transpiler ---> Python
    |
    +---> Native Codegen ---> x86/x64
```

## License

Proprietary - CODURRA Labs & Technologies
