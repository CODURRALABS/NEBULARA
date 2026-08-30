# Lesson 00 — Setup & Hello World

Welcome to Nebulara. In this first lesson you'll get the language running and
print your first message. This takes about two minutes.

---

## 1. What you need

Nebulara compiles to a standalone interpreter from a **single C source file**
(`Compiler/nbs-bootstrap.c`). You need:

- A C compiler: **gcc** (MinGW on Windows, gcc/clang on Linux/macOS), or
- A pre-built binary in `build/` (e.g. `build/nebulara.exe` on Windows), or
- The `neb` wrapper / `nebulara` command already on your `PATH`.

### Check if it's already here
From the Nebulara repo root:
```bash
# Windows
build\nebulara.exe      # no args -> prints the version/usage banner
# Linux/mac
./build/nebulara
```
If you see `Nebulara Interpreter ... Usage: ... <file.nbs>`, you're ready.

> Note: this build's bare interpreter takes **one file argument**. Running with
> no argument prints the banner; passing `--help` is treated as a filename.
> The richer `neb-cli` / `neb` wrappers provide `run`/`repl`/`build` subcommands
> (see the [CLI cheat sheet](../cheat-sheets/cli.md)).

### Add to PATH (optional, once)
```bash
# Windows (PowerShell)
$env:PATH += ";$PWD\build"
# Linux/mac
export PATH="$PWD/build:$PATH"
```
Now you can type `nebulara` from anywhere.

---

## 2. Your first program

Create a file `hello.nbs`:

```nbs
# My first Nebulara program
PRINT "Hello, Nebulara!"
```

Save it, then run it:
```bash
nebulara hello.nbs
```

You should see:
```
Hello, Nebulara!
```

**You just ran a Nebulara program.** 🎉

---

## 3. How a program runs (concept)

When you run `nebulara hello.nbs`, this happens under the hood:

```
hello.nbs
   │
   ▼
 Lexer  ──► tokens          (splits text into meaningful pieces)
   │
   ▼
 Parser ──► AST/IR          (builds a tree of what you wrote)
   │
   ▼
 Compiler ──► bytecode      (turns tree into VM instructions)
   │
   ▼
 VM ──► output              (executes, prints "Hello, Nebulara!")
```

You don't need to know these layers yet — but they'll matter in the
[Advanced Guides](../advanced/README.md). For now, know that `PRINT` is the
way to show output.

---

## 4. Understanding `PRINT`

`PRINT` outputs its argument followed by a newline:

```nbs
PRINT "first line"
PRINT "second line"
```
prints:
```
first line
second line
```

You can print numbers too:
```nbs
PRINT 42
PRINT -7
```
```
42
-7
```

---

## 5. The all-caps keyword style

Nebulara keywords are **uppercase words**, and some carry a symbol suffix:

- `PRINT` — output
- `FUNC!` / `END!` — function blocks (note the `!`)
- `IF?` — conditionals (note the `?`)
- `LET` / `CONST` — variables

Why? It makes keywords visually pop out of your code and keeps them distinct
from variable/function names. You'll internalize the style quickly.

---

## Try it

1. Change the message to your own name and re-run.
2. Add a second `PRINT` line with a number.
3. Print an empty line: `PRINT ""`.

---

## Exercises

1. Write a program that prints the text `Learning Nebulara!`.
2. Write a program that prints three separate lines: `one`, `two`, `three`.
3. What happens if you run `nebulara` with **no** file argument? (Try it. It
   should show usage and exit.)

### Answers
1.
```nbs
PRINT "Learning Nebulara!"
```
2.
```nbs
PRINT "one"
PRINT "two"
PRINT "three"
```
3. It prints the usage/help banner and exits — it needs a `.nbs` file to run.

---

## Checkpoint
- You can run a `.nbs` file. ✅
- You know `PRINT` prints a value + newline. ✅
- You can spot Nebulara's uppercase keyword style. ✅

Next: **[Lesson 01 — Values & Variables](01-values-and-variables.md)**
