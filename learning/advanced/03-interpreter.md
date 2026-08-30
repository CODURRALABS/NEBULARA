# Advanced 03 — The Interpreter Internals

The heart of Nebulara is `Compiler/nbs-bootstrap.c` — a single C file that is a
complete **self-hosted interpreter** (lexer, parser, compiler, VM, builtins,
and FFI). This guide walks the high-level design.

---

## Values: a tagged union

The runtime represents every value as a **tagged union**:

```c
struct Value {
    int type;            // VAL_NULL, VAL_INT, VAL_STRING, VAL_BOOL, VAL_ARRAY, VAL_FUNC
    union {
        int64_t i;       // int
        char*  s;        // string
        int     b;       // bool
        ValueArray* a;   // array
        int     func_idx;// function index
    } as;
};
```

A `type` tag plus a shared union of possible payloads. This is a classic
dynamic-language design: cheap to create, and it's why `TYPEOF` and
`TO_STRING` work uniformly on any value.

**Arrays** are `ValueArray`: a growable list of `Value`s with count/capacity.
`PUSH` resizes when full; `POP` decrements count and returns the element.

---

## Lexer

A hand-written tokenizer. It:
- recognizes uppercase keywords (`FUNC!`, `IF?`, `LET`, ...),
- scans numeric literals and double-quoted strings,
- emits operators and identifiers,
- reports `LexError { line, col, msg }` for bad input.

`Compile error` / `Parse error` messages with line:col come from here or the
parser.

---

## Parser -> IR

The parser builds an **IR tree** (`Compiler/neb-ir.c` defines the node model).
Each node has a kind, optional string/int/float values, parameters, optional
META blocks, and ordered children (`a`, `b`, `c` operands plus `kids`).

The IR is the single structured description of a program, and (per the v4
spec) is designed to be the round-trip source of truth — source in, IR, source
back out losslessly.

---

## Compiler -> bytecode

The IR is walked to emit bytecode. Opcodes include pushes (`PUSH_INT`,
`PUSH_STR`), arithmetic (`ADD`, `SUB`, ...), jumps (`JUMP_IF`), output
(`PRINT`), and calls (`CALL`). Constants are interned in a string pool so
instructions reference indices, not inline text.

---

## VM loop

The `switch` over `BC_*` cases executes instructions:
- `BC_PRINT` pops, stringifies, prints.
- `BC_CALL` pops args, resolves name, dispatches **builtins** (by name compare)
  or calls user functions.
- `BC_JUMP_IFNOT` / `BC_JUMP_IF` implement branching for `IF?`/`WHILE?`.

Builtins like `LEN`, `ABS`, `SQRT`, `PUSH`, `POP`, `READ_FILE`,
`WRITE_FILE`, `FFI_*` are all implemented as named branches in this loop.

---

## FFI subsystem

The interpreter keeps up to 64 loaded libraries, each with up to 256 registered
functions. It uses `LoadLibraryA`/`GetProcAddress` on Windows or `dlopen`/`dlsym`
elsewhere to resolve and call C symbols. See
[06 — FFI](06-ffi.md) for the language-level usage.

---

## Self-hosting

Alongside the C interpreter, the language is described **in itself**:
- `Grammar/grammar.nbs`, `Compiler/lexer.nbs`, `Compiler/compiler.nbs`.

This is the "self-hosted" ambition: Nebulara implementing Nebulara. The C file
is the bootstrap; the `.nbs` files are the next generation of the toolchain,
moving the language toward compiling itself (a milestone reached more fully in
the PRIMORDIA project).

---

## Reading suggestions

Start with the `Value` struct and `val_*` helpers, then the lexer's token
recognition, then the VM's main `switch` (read the `BC_PRINT` and `BC_CALL`
cases first). They reveal the whole design in under an hour.
