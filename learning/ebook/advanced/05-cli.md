# Chapter 5 — The Command-Line Interface (neb-cli)

> Book: *Beyond the Bases* · Part II — The Toolchain

`neb-cli` is the friendly front-end for Nebulara. It wraps the interpreter and
toolchain in subcommands.

---

## Available commands

```bash
neb-cli run <file.nbs>       # run a source file
neb-cli build <file.nbs>     # compile to bytecode (.nbsc)
neb-cli repl                 # open an interactive REPL
neb-cli highlight <file.nbs> # print the source syntax-highlighted
neb-cli version              # print tool version
neb-cli help                 # show commands
```

---

## `run`

The quickest way to execute a script:

```bash
neb-cli run hello.nbs
```

Equivalent to `nebulara hello.nbs` — this is the "just run it" path.

---

## `build` — bytecode compilation

```bash
neb-cli build hello.nbs
```

produces a compiled `.nbsc` file. Bytecode is the interpreter's native format
(see Chapter 11 — the VM). Building is a useful step when you want a
pre-parsed artifact, or when packaging a program.

*Note: round-trip/decompilation of `.nbsc` back to source is a roadmap item
in the PRIMORDIA project — don't rely on reading `.nbsc` as text today.*

---

## `repl`

The REPL is an **interactive shell**: type an expression, get an answer. It's
the best way to experiment:

```bash
neb-cli repl
> 2 + 2
4
> LET x = 10
> x * 3
30
> TYPEOF("hi")
string
> PRINT "hi"
hi
```

Use the REPL to probe features (does `TRY` parse? does `META` exist?), test
snippets, and explore before committing to a file. This makes it your best
tool against doc drift — a 5-second check that beats reading stale docs.

---

## `highlight`

```bash
neb-cli highlight app.nbs
```

Prints the source with syntax coloring (ANSI escapes on a terminal). Nice for
reading unfamiliar code or verifying the lexer tokenizes a file the way you
expect.

---

## Programmatic drive

Because `neb-cli` is a normal command, you can drive it from other tools —
shell scripts, build systems, or the Node/Python wrappers. This is how the
npm wrapper (`neb run`, `neb build`, `neb repl`, `neb highlight`) forwards to
the C CLI.

---

## Summary

- `run`, `build`, `repl`, `highlight`, `version`, `help`.
- `repl` is your probe tool — use it to verify features against the real
  binary.
- `build` produces `.nbsc` bytecode (no decompilation yet).
- The wrappers (npm/pip) forward to this CLI.

**Next:** [Chapter 6 — The Package Manager](06-package-manager.md)
