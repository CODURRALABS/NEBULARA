# Chapter 9 — Native Code Generation

> Book: *Beyond the Bases* · Part III — Going Universal

At the far end of the toolchain sits **native code generation**: turning
Nebulara into actual machine code for the host CPU, with no interpreter loop at
runtime.

---

## Why native?

The interpreter reads and runs bytecode one instruction at a time. Native code
is compiled once to CPU instructions, so the CPU executes your logic directly.
That means:

- **Speed** — no per-instruction dispatch overhead.
- **Portability of deployment** — ship a runnable binary, not a script.
- **Integration** — call into other native code easily.

---

## Which architectures?

`neb-codegen` targets the **x86/x64** family — the CPUs in most Windows, Linux,
and macOS desktops and servers. (The command-invocation and VM layers live in
`neb-codegen.c`.)

---

## What it produces

```bash
neb-codegen file.nbs
```

The tool walks the program's behavior and emits machine instructions
corresponding to operations (math, control flow, function calls). The compiler
side tracks state so the emitted code matches what the program semantics
require.

---

## How it relates to the other targets

Think of the toolchain as a spectrum:

```
source ─► bytecode (VM) ─► IR ─► JS/Python/Native
```

- **Bytecode + VM** = portable, safe, slower.
- **JS/Python** = reach other runtimes (transpiler).
- **Native** = fastest on the host (codegen).

Same source, choose your target based on need: correctness first
(interpreter), reach (transpiler), or speed (native).

---

## A word of caution

Native codegen is the most complex and least-exercised tool in the family.
Treat it as appropriate for performance-critical or maybe-experimental use, and
keep your source portable so you can always fall back to the interpreter or
transpiler. Verify behavior matches the interpreter for anything serious.

---

## Summary

- `neb-codegen` emits x86/x64 machine code.
- Native = speed, no interpreter loop at runtime.
- It's the fastest end of a spectrum (interpreter → transpiler → native).
- Most complex tool; fall back to interpreter/transpiler when portability or
  simplicity wins.

**Next:** [Chapter 10 — The Pipeline](10-pipeline.md)
