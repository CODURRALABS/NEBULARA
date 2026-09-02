# Lesson 08 — Handling Errors

Things go wrong in real programs. This lesson is about **error handling**.
It covers both approaches in Nebulara: the **exception syntax** and the
**guarding approach**.

> **Status:** `TRY!`/`CATCH!`/`FINALLY!`/`ENDTRY!`/`THROW` are implemented in
> the current source (`Compiler/nbs-bootstrap.c`). Note the **`!` suffix** on
> the block keywords and **parens on `THROW`**. If your *shipped* `.exe`
> predates this, rebuild from source or use the guarding pattern below — both
> are worth knowing.

---

## 1. Why error handling matters

```nbs
LET n = TO_NUMBER("not a number")   # returns 0, doesn't crash
```
`TO_NUMBER` doesn't raise — it returns `0` on failure. That means *you* must
notice the bad value and handle it. That's the guarding pattern.

---

## 2. The guarding pattern (works today)

Because the builtins return sentinel values (`0`, `NULL`, `FALSE`) on failure,
you check them explicitly:

```nbs
LET data = READ_FILE("notes.txt")
IF? data:
    PRINT data
ELSE:
    PRINT "could not open notes.txt"
END!
```

```nbs
LET n = TO_NUMBER("abc")
IF? n == 0:
    PRINT "that wasn't a valid number"
ELSE:
    PRINT "number is " + n
END!
```

This is simple, explicit, and robust — and it runs on every build.

---

## 3. Guarding in a function (works today)

Wrap checks so callers get a clean answer:

```nbs
FUNC! read_or_empty(path):
    LET data = READ_FILE(path)
    IF? data:
        RETURN data
    END!
    RETURN ""
END!

PRINT read_or_empty("missing.txt")    # (empty line)
```

```nbs
FUNC! parse_int(s):
    LET n = TO_NUMBER(s)
    IF? n == 0:
        RETURN 0
    END!
    RETURN n
END!
```

---

## 4. The exception syntax

The language supports `TRY!`/`CATCH!`/`FINALLY!`/`ENDTRY!`/`THROW`:

```nbs
TRY!
    THROW("something went wrong")
CATCH! err:
    PRINT "Caught: " + err
ENDTRY!
```

- `THROW(value)` raises an exception carrying `value`.
- `CATCH! err:` binds the thrown value to `err`.
- `FINALLY!` always runs, error or not (optional).
- `ENDTRY!` closes the block.

A more realistic usage:

```nbs
TRY!
    LET n = TO_NUMBER("not a number")
    IF? n == 0:
        THROW("parse failed")
    END!
    PRINT n
CATCH! err:
    PRINT "Error: " + err
FINALLY!
    PRINT "done"
ENDTRY!
```

When a step can fail, exceptions are the idiomatic way to signal it. The
guarding pattern from §2–3 remains useful for non-throwing sentinel returns.

> **Note on syntax:** block keywords carry a `!` (`TRY!`, `CATCH!`, `FINALLY!`,
> `ENDTRY!`) and `THROW` uses parentheses (`THROW("msg")`).

---

## Try it

Write a program that reads a file and reports whether it opened — using the
guarding pattern:

```nbs
LET data = READ_FILE("data.txt")
IF? data:
    PRINT "read " + LEN(data) + " chars"
ELSE:
    PRINT "file not found"
END!
```

---

## Exercises

1. What does `TO_NUMBER("hello")` return, and how do you guard against it?
2. Write a guard that prints `"empty"` when a file is missing, else its contents.
3. (If your build supports it) Convert the guard into a `TRY!`/`CATCH!`.

### Answers
1. `0`. Guard with `IF? n == 0:` then handle it.
2.
```nbs
LET data = READ_FILE("f.txt")
IF? data:
    PRINT data
ELSE:
    PRINT "empty"
END!
```
3.
```nbs
TRY!
    LET data = READ_FILE("f.txt")
    IF? data == NULL:
        THROW("empty")
    END!
    PRINT data
CATCH! err:
    PRINT err
ENDTRY!
```

---

## Checkpoint
- Builtins return sentinel values (`0`/`NULL`/`FALSE`) on failure. ✅
- You can guard errors with `IF?` — the pattern that always works. ✅
- You know the `TRY!`/`CATCH!`/`FINALLY!`/`ENDTRY!`/`THROW` syntax. ✅

Next: **[Lesson 09 — Files & System](09-files-and-system.md)**
