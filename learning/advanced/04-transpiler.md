# Advanced 04 — Transpiling to JavaScript & Python

Nebulara's **pipeline** (`neb-pipeline.exe`) can translate a `.nbs` program
into JavaScript or Python source. This is one of the language's headline
features: write once, run on many runtimes.

---

## The command

```bash
neb-pipeline file.nbs --target js     # JavaScript
neb-pipeline file.nbs --target py     # Python
neb-pipeline file.nbs --target ir     # dump the IR tree
neb-pipeline file.nbs --check         # semantic check only
```

If you omit `--target`, JS is the default.

---

## A worked example

Given `hello.nbs`:
```nbs
LET x = 10
PRINT x * 2
```

`neb-pipeline hello.nbs --target js` produces roughly:
```js
'use strict';
let x = 10
console.log((x * 2))
```

JavaScript transpilation maps Nebulara constructs onto JS equivalents:

| Nebulara | JavaScript |
|----------|------------|
| `LET x = v` | `let x = v` |
| `PRINT(x)` | `console.log(...)` |
| `IF? c:` ... `END!` | `if (c) { ... }` |
| `FUNC! f(a,b):` ... `END!` | `function f(a,b) { ... }` |
| `TRUE` / `FALSE` | `true` / `false` |
| `AND` / `OR` / `NOT` | `&&` / `||` / `!` |
| arrays, indexing | arrays, indexing |

Python transpilation targets the `py` target and maps to Python constructs
(`print(...)`, `if ...:`, `def`).

---

## Why transpile?

1. **Interop** — reuse the JS or Python ecosystem without rewriting.
2. **Portability** — emit code that runs in browsers/Node or with Python's
   tooling.
3. **Embedding** — script generation for other systems.

---

## Caveats

- The transpiler maps the **core language** (variables, arithmetic, control
  flow, functions, arrays, `PRINT`). Check whether specific builtins or stdlib
  calls have faithful mappings for your target before relying on behavior
  parity.
- String concatenation, integer division semantics, and `NULL` handling may
  differ between Nebulara and JS/Python — verify edge cases.
- The output is *generated source*; treat it as a starting point, not a license
  to stop reviewing.

---

## IR mode

`--target ir` prints the intermediate representation tree. This is the same
structure the parser produces before code generation — see
[01 — the pipeline](01-pipeline.md). It's invaluable for understanding how
your code is structured and for debugging the semantics.
