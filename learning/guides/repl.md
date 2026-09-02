# Guide: Interactive REPL

The REPL ("Read-Eval-Print Loop") is Nebulara's **interactive shell**: you type
and get answers immediately — no file needed.

---

## Starting it

If you have the CLI binary:
```bash
neb-cli repl
```

You should get a prompt (often `>`). Type an expression and press Enter to see
the result, then exit with `exit` / `quit`.

---

## What you can do

**Evaluate expressions:**
```
> 2 + 2
4
> TYPEOF("hi")
string
> ABS(-9)
9
```

**Declare and use variables:**
```
> LET x = 10
> x * 3
30
```

**Call functions:**
```
> LET f = ...   # inline definitions may vary by build
> PRINT "hi"
hi
```

---

## The killer use: probing

The REPL is the **fastest truth-checker** in Nebulara. Whenever you read about
a feature and aren't sure your binary has it, probe it here in 5 seconds:

```
> SLEEP(100)
```
- If you get a value/blank → it's supported.
- If you get an error → it's not in your build.

Same for keywords:
```
> TRY!
```
- If it errors at parse → your build is older than the source → rebuild
  `nbs-bootstrap.c` to get the current feature set.

This turns "does doc X match reality?" from a research task into a keystroke.

---

## Limits

- The REPL is line-oriented; large multi-line programs are easier in a file.
- Complex nested definitions are more reliably written to `.nbs` files and run.
- The REPL shows the *result value*; for side-effecting statements like `PRINT`,
  you see the effect(s) followed by the value.

---

## If you don't have `neb-cli repl`

- **Fallback:** write a `.nbs` file and run `nebulara file.nbs` — a loop for
  quick testing.
- **Wrapper:** the npm `neb` tool exposes `neb repl` forwarding to the same
  CLI.

---

## Workflow recommendation

- Use the REPL for **exploration and probing**.
- Use files for **anything you want to keep or run repeatedly**.
- Probe a feature in the REPL *before* committing it to a file.
