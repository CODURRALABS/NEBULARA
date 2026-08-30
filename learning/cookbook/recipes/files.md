# File Recipes

## Write a file
```nbs
WRITE_FILE("out.txt", "Hello from Nebulara!")
```
Creates/overwrites `out.txt`.

## Read a file
```nbs
LET content = READ_FILE("out.txt")
PRINT content
```

## Read with a guard (always do this)
```nbs
LET content = READ_FILE("maybe.txt")
IF? content:
    PRINT "Read: " + content
ELSE:
    PRINT "No such file."
END!
```

## Append to a file (read + combine + write)
Since `WRITE_FILE` overwrites, append means rebuild:
```nbs
FUNC! append_file(fname, line):
    LET existing = READ_FILE(fname)
    LET combined = ""
    IF? existing:
        combined = existing + "\n"
    END!
    WRITE_FILE(fname, combined + line)
END!

append_file("log.txt", "first")
append_file("log.txt", "second")
PRINT READ_FILE("log.txt")
```

## Write multi-line content
```nbs
LET body = "line one\nline two\nline three"
WRITE_FILE("data.txt", body)
```

## Read numbers from a file
Scores on separate lines, summed:
```nbs
# Assume scores.txt contains numbers separated by whitespace/newlines.
LET raw = READ_FILE("scores.txt")
IF? NOT raw:
    PRINT "no scores"
ELSE:
    PRINT "raw bytes: " + LEN(raw)
    # (Parsing all numbers from one blob needs a split helper;
    #   if unavailable, feed an array directly instead.)
END!
```
> Split-by-whitespace isn't a base builtin. If you need it, implement a
> `split(s, delim)` helper with `SUBSTR`/`CHAR_AT` (see the string recipes and
> stdlib `string.nbs`).

## Persist a single number across runs
```nbs
# Run this file multiple times; the count grows.
FUNC! read_int(fname):
    LET raw = READ_FILE(fname)
    IF? raw:
        RETURN TO_NUMBER(raw)
    END!
    RETURN 0
END!

LET count = read_int("count.txt")
count = count + 1
WRITE_FILE("count.txt", TO_STRING(count))
PRINT "Run #" + count
```

## Copy a file
```nbs
LET src = READ_FILE("a.txt")
IF? src:
    WRITE_FILE("b.txt", src)
    PRINT "copied"
ELSE:
    PRINT "source missing"
END!
```

## Guard tips
- Always `IF?` a `READ_FILE` result before using it.
- `WRITE_FILE` to a path you can't create won't succeed — verify the directory
  exists.
- Files are relative to the working directory where you run the interpreter.
