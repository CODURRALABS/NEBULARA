# Advanced 01 — How a Program Runs (the Pipeline)

Every Nebulara run follows the same path. Understanding the stages turns the
language from "magic" into a machine you can reason about.

```
source.nbs
    │
    ▼
1. LEXER ──────────► tokens          (meaningful chunks of text)
    │
    ▼
2. PARSER ─────────► AST / IR tree   (structure of your program)
    │
    ▼
3. COMPILER ───────► bytecode        (VM instructions, one opcode at a time)
    │
    ▼
4. VM ─────────────► output          (executes instructions, side effects)
```

---

## 1. Lexer

The **lexer** (tokenizer) reads the raw text and splits it into **tokens** —
the smallest meaningful units: keywords, identifiers, numbers, strings,
operators, punctuation.

Example: `LET x = 10` becomes roughly:
```
LET        (keyword)
x          (identifier)
=          (operator/equals)
10         (int literal)
```
Nebulara's lexer recognizes the uppercase keywords (`FUNC!`, `IF?`, `LET`, ...)
and string literals in double quotes.

**In the code:** `Compiler/nbs-bootstrap.c` has the token scanner; the language
also documents its grammar in `Grammar/*.nbs` and `Compiler/lexer.nbs` —
Nebulara describing its own lexer, in Nebulara.

---

## 2. Parser

The **parser** takes the flat token stream and builds a **tree** (AST — Abstract
Syntax Tree) that encodes the structure: a function node contains its params and
body; an `IF?` node contains its condition and branch children; an expression
node contains its left/right operands.

`PRINT 10 + 5 * 2` becomes a tree where the `*` binds tighter:
```
PRINT
  └─ +
     ├─ 10
     └─ *
        ├─ 5
        └─ 2
```
This is why `10 + 5 * 2` = `20`.

**In the code:** the parser produces an IR (intermediate representation). The
`Compiler/neb-ir.c` file defines the IR node model, and `Compiler/neb-pipeline.c`
can dump it with `--target ir` or `--ir`.

---

## 3. Compiler

The **compiler** walks the AST and emits **bytecode** — a compact list of
instructions for the VM. Nebulara is a **stack-based VM** design: arithmetic
pops operands off a stack and pushes results back.

`PRINT 10 + 5` might compile to something like:
```
PUSH 10
PUSH 5
ADD           # pop 5 and 10, push 15
PRINT         # pop 15, print it
```

**In the code:** the compiler lives in the interpreter source and in
`Compiler/compiler.nbs` (self-hosted). `neb-cli build file.nbs` serializes
this bytecode to a `.nbsc` file.

---

## 4. VM (Virtual Machine)

The **VM** fetches each instruction and executes it. It maintains:
- a **stack** of values (for arithmetic and function calls),
- a **constant pool** (strings/numbers referenced by instruction),
- an **instruction pointer** (which instruction is next).

`PRINT`, `LEN`, `ABS`, etc. are implemented as VM opcodes or as builtin
dispatch in the interpreter loop. The VM is the thing actually "running"
your program and producing output.

**In the code:** the big `switch` over opcodes in `Compiler/nbs-bootstrap.c`
(the `BC_*` cases) is the VM loop. `Compiler/neb-codegen.c` goes further and
encodes native x86/x64 instructions — a native-compiler path.

---

## Why this matters

- **Compile errors** come from the lexer/parser stage (e.g. `Parse error:
  Unexpected NbsToken`).
- **Runtime errors** (e.g. `undefined function 'X'`) come from the VM stage.
- Knowing the pipeline lets you predict: "is this a syntax problem or a
  behavior problem?" — and read the error messages correctly.

---

## Try it yourself

1. Run `neb-pipeline file.nbs --target ir` to see the IR tree for a small file.
2. Run `neb-pipeline file.nbs --target js` to see the transpiled JavaScript.
3. Run `neb-cli build file.nbs` to produce `.nbsc`, then `neb-cli run` it.

These give you a behind-the-curtain view of stages 2–4.

Next: **[02 — The Bytecode VM](02-vm.md)**
