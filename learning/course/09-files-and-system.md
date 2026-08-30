# Lesson 09 — Files, Time & System

Programs interact with the real world: files, the clock, and (via FFI) C
libraries. Nebulara has builtins for these. This lesson uses the verified
runtime builtins.

> **Which binary to use:** this repo ships two interpreters. Use the **newer
> one** that best matches the source — on Windows that's
> `Compiler\nebulara.exe` (newer than `build\nebulara.exe`). Run your files
> with it. See the [README's run-target note](../README.md#choosing-a-run-target-important).

---

## 1. Which system builtins actually run

Verified on the interpreter (see `Compiler/nbs-bootstrap.c` builtin dispatch):

| Builtin | Purpose |
|---------|---------|
| `TIME()` | current epoch seconds (int) |
| `READ_FILE(path)` | file contents as string, `NULL` if missing |
| `WRITE_FILE(path, content)` | `TRUE` on success, `FALSE` on failure |
| `FFI_LOAD` / `FFI_REGISTER` / `FFI_CALL` | call C functions |

**Not currently wired into the shipped executables** (present in newer source
but not the built binaries): `SLEEP`, `ARGUMENT_COUNT`, `ARGUMENT`. Don't rely
on them until a build that supports them ships — guard with what works.

---

## 2. Reading a file

`READ_FILE(path)` returns the contents, or `NULL` if the file can't be opened:

```nbs
LET data = READ_FILE("notes.txt")
IF? data:
    PRINT "File contents:"
    PRINT data
ELSE:
    PRINT "Could not open file"
END!
```

Create `notes.txt` next to your script and run it.

---

## 3. Writing a file

`WRITE_FILE(path, content)` writes and returns `TRUE`/`FALSE`:

```nbs
LET ok = WRITE_FILE("out.txt", "Hello from Nebulara!")
IF? ok:
    PRINT "Written."
ELSE:
    PRINT "Write failed."
END!
```

Check `out.txt` afterward.

---

## 4. Appending (read + write)

Since you can't append directly, read, combine, and write back:

```nbs
FUNC! append_file(path, line):
    LET old = READ_FILE(path)
    IF? old == NULL:
        old = ""
    END!
    RETURN WRITE_FILE(path, old + line + "\n")
END!

append_file("log.txt", "first entry")
append_file("log.txt", "second entry")
PRINT READ_FILE("log.txt")
```

---

## 5. Time

`TIME()` returns the current Unix epoch (seconds since 1970):

```nbs
LET now = TIME()
PRINT now                # e.g. 1788070000
```

You can time things by capturing `TIME()` before and after:

```nbs
LET start = TIME()
# ... do work ...
LET end = TIME()
PRINT "took " + (end - start) + " seconds"
```

---

## 6. FFI — calling C (the escape hatch)

Nebulara can call C library functions. This is powerful but platform-specific:

```nbs
FFI_LOAD("msvcrt", "msvcrt.dll")
FFI_REGISTER("msvcrt", "abs", 1, 1)     # ret=INT(1), 1 arg
PRINT FFI_CALL("msvcrt", "abs", -42)
```

Steps:
1. `FFI_LOAD(name, path)` loads a DLL/so under a name.
2. `FFI_REGISTER(lib, symbol, returnType, argCount)` declares a function.
3. `FFI_CALL(lib, symbol, args...)` calls it.

The return-type codes and argument mapping are platform-specific — see the
[Advanced FFI guide](../advanced/06-ffi.md) before relying on it in real work.

---

## 7. A real mini-program — a counter stored in a file

```nbs
FUNC! increment(path):
    LET n = TO_NUMBER(READ_FILE(path))
    n = n + 1
    WRITE_FILE(path, TO_STRING(n))
    RETURN n
END!

PRINT increment("count.txt")   # 1
PRINT increment("count.txt")   # 2
PRINT increment("count.txt")   # 3
```

*(`TO_NUMBER` returns 0 for a missing/unparseable file, so the first run goes
1 → 2 → 3 correctly.)*

---

## Try it

1. Write your name to `me.txt`, read it back, print it.
2. Store the current `TIME()` in a variable and print it.
3. Build a small key–value store with `WRITE_FILE` + `READ_FILE` (store a number, retrieve it).

```nbs
WRITE_FILE("me.txt", "Ayush")
PRINT READ_FILE("me.txt")
PRINT TIME()
```

---

## Exercises

1. Write a program that counts how many times it has been run (persist a counter).
2. Using `TIME()`, write a loop that touches 1,000 iterations and report elapsed time.
3. Read `README.md` and print its length.

### Answers
1. See the counter example in §7 above.
2.
```nbs
LET start = TIME()
LET i = 0
WHILE? i < 1000:
    i = i + 1
END!
PRINT "elapsed " + (TIME() - start) + "s"
```
3.
```nbs
LET r = READ_FILE("README.md")
PRINT LEN(r)
```

---

## Checkpoint
- Use the newest interpreter binary. ✅
- `READ_FILE` / `WRITE_FILE` with error checks (guarding). ✅
- `TIME()` for timestamps and rough timing. ✅
- FFI exists as the way to call C. ✅
- Know `SLEEP`/args aren't in shipped builds yet. ✅

Next: **[Lesson 10 — Standard Library & Modules](10-stdlib-and-modules.md)**
