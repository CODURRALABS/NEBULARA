# Chapter 12 — Files and the Real World

> Book: *Nebulara From Zero* · Part III — Structuring Programs

So far our programs only printed. Real programs touch the outside world —
notably **files** (read and write). Nebulara has two builtins for this:
`READ_FILE` and `WRITE_FILE`.

---

## Writing a file: `WRITE_FILE`

```nbs
WRITE_FILE("out.txt", "Hello from Nebulara!")
```

This creates (or overwrites) `out.txt` containing the text. If the file
doesn't exist, it's created; if it does, it's replaced.

---

## Reading a file: `READ_FILE`

```nbs
LET content = READ_FILE("out.txt")
PRINT content
```
```
Hello from Nebulara!
```

Give it a filename, get the whole contents as a string.

---

## Always guard the read

The file might not exist. Guard it (Chapter 11):

```nbs
LET content = READ_FILE("missing.txt")
IF? content:
    PRINT "Read: " + content
ELSE:
    PRINT "No file to read."
END!
```

This is the reliable pattern. Never assume a read succeeds.

---

## A complete read/write loop

Write some data, then read it back:

```nbs
WRITE_FILE("journal.txt", "Day 1: learned Nebulara.")
WRITE_FILE("journal.txt", "Day 2: wrote files.")   # overwrites!

LET entry = READ_FILE("journal.txt")
PRINT entry
```
```
Day 2: wrote files.
```

Note that the second `WRITE_FILE` **overwrites** the first. To keep both, you
read-accumulate-write (next section).

---

## Appending: read, add, write back

Since `WRITE_FILE` overwrites, "append" means: read what's there, add to it,
write it all back.

```nbs
FUNC! append_file(filename, text):
    LET existing = READ_FILE(filename)
    LET combined = ""
    IF? existing:
        combined = existing + "\n"
    END!
    WRITE_FILE(filename, combined + text)
END!

append_file("log.txt", "first line")
append_file("log.txt", "second line")

PRINT READ_FILE("log.txt")
```

Now the file accumulates lines. (The `"\n"` is a newline so lines don't smash
together — more on escapes below.)

---

## Giving yourself input: the command line and files

The shipped interpreter doesn't have interactive `READ`/`INPUT` builtins, so
the **file** is your main avenue for supplying dynamic input. A common trick:
store the input in a file, read it in, process it, write the result out. This is
also how you'd build a persistent counter or a record of anything.

---

## Escape characters in strings

Inside a string, `\n` means a newline and `\t` a tab:

```nbs
PRINT "line1\nline2"
```
```
line1
line2
```

Use `\n` when you want to write multi-line content to a file.

---

## Putting it together: a mini counter

Persist a number across runs using a file:

```nbs
# counter.nbs - run it multiple times to see it grow
FUNC! read_counter(fname):
    LET raw = READ_FILE(fname)
    IF? raw:
        RETURN TO_NUMBER(raw)
    END!
    RETURN 0
END!

LET count = read_counter("count.txt")
count = count + 1
WRITE_FILE("count.txt", TO_STRING(count))
PRINT "Run #" + count
```

Run it three times: it prints `Run #1`, `Run #2`, `Run #3`. The number persists
between runs in `count.txt`. That's your first real-state program.

---

## A caution on paths

Files are read/written relative to where you run the interpreter. Use simple
filenames in the same folder while learning. `WRITE_FILE` on a path that can't
be created (bad directory) won't succeed — guard if it matters.

---

## Try it

1. Write `"hello"` to `a.txt`, read it back, print it.
2. Create an append-file helper and add three lines to a log.
3. Build a persistent counter and run it 5 times.

---

## Chapter takeaways

- `WRITE_FILE(name, text)` writes/overwrites a file.
- `READ_FILE(name)` returns the contents or a null-sentinel.
- Guard every read with `IF?`.
- Append = read + combine + write back.
- Files are your primary way to persist state and give input.

**Next:** [Chapter 13 — A Complete Project](13-project.md)
