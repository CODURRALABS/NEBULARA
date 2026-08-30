# Guide: Getting Started (Setup)

This guide walks you from zero to a running Nebulara program.

---

## Step 1 — Get an interpreter

You need one executable. Options:

**A. Use a pre-built binary (easiest, Windows).**
- `Compiler/nebulara.exe` — **newest**, best match to current source.
- `build/nebulara.exe` — older.
- Use `Compiler/nebulara.exe` for new work.

**B. Build from source (any OS, needs gcc).**
```bash
gcc -static -O2 Compiler/nbs-bootstrap.c -o nebulara -lm
```

**C. Install a wrapper (npm / pip).**
```bash
npm install -g nebulara     # gives `neb` + a Nebulara runner
# or
pip install nebulara
```

> **Pin your binary.** Behaviors differ between builds. Decide on one for your
> project and note it (e.g. in a comment or README).

---

## Step 2 — Verify it runs

Create a file `hello.nbs`:
```nbs
PRINT "Hello, Nebulara!"
```
Run it:
```bash
nebulara hello.nbs
```
Expected output:
```
Hello, Nebulara!
```

If you used the npm CLI:
```bash
neb run hello.nbs
```

---

## Step 3 — Learn to probe

Before building on any feature, confirm it exists in *your* binary. Write a
tiny probe file:

```nbs
# probe.nbs
PRINT TYPEOF(10)
SLEEP(100)          # does SLEEP exist in this build?
```
Run it. If `SLEEP` errors, it's not built in — don't use it. This one habit
saves the most time in this language (docs drift).

**Quick probe of the verified builtins** (these should all work):
```nbs
PRINT LEN("hi")        # 2
PRINT TYPEOF(1)        # int
PRINT ABS(-4)          # 4
PRINT RANDOM()         # 0..99
PRINT TO_UPPER("a")    # A
```

---

## Step 4 — Interactive exploration (optional)

If you have `neb-cli`:
```bash
neb-cli repl
> 2 + 2
4
```
Great for quick experiments. See the [REPL guide](repl.md).

---

## Step 5 — Choose your learning path

- **Fast, hands-on:** the [Course](../course/README.md).
- **Deep reading:** [Book 1 — Nebulara From Zero](../ebook/README.md).
- **Reference:** the [Cheat Sheets](../cheat-sheets/syntax.md) and [Manual](../manuals/README.md).

---

## Checklist
- [ ] I have a `nebulara` that runs `hello.nbs`.
- [ ] I know which binary I'm using.
- [ ] I can probe a feature (tiny test file).
- [ ] I know where `Compiler/nebulara.exe` lives in this repo.
