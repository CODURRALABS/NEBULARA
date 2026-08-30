# Persistence & Counters

## A persistent counter (file-backed state)
**Problem:** keep a number that survives between program runs.
```nbs
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
Run it repeatedly — the counter grows because `count.txt` remembers.

## High-score tracker (max across runs)
```nbs
FUNC! load_score(fname):
    LET raw = READ_FILE(fname)
    IF? raw:
        RETURN TO_NUMBER(raw)
    END!
    RETURN 0
END!

LET best = load_score("best.txt")
LET current = 75
IF? current > best:
    best = current
    WRITE_FILE("best.txt", TO_STRING(best))
END!
PRINT "High score: " + best
```

## Simple settings file (`key=value`)
Write & read a single setting:
```nbs
# Save
WRITE_FILE("settings.txt", "volume=7")

# Load
LET raw = READ_FILE("settings.txt")
LET vol = 0
IF? raw AND SUBSTR(raw, 0, 7) == "volume=":
    vol = TO_NUMBER(SUBSTR(raw, 7, LEN(raw) - 7))
END!
PRINT "volume: " + vol
```
> For multiple settings, store them as `name=value` lines and parse with a
> `split` helper (stdlib `string.nbs` / `fmt.nbs`).

## A simple key/value store (append log of entries)
```nbs
FUNC! append_file(fname, line):
    LET existing = READ_FILE(fname)
    LET combined = ""
    IF? existing:
        combined = existing + "\n"
    END!
    WRITE_FILE(fname, combined + line)
END!

append_file("events.txt", "start@1")
append_file("events.txt", "done@2")
PRINT READ_FILE("events.txt")
```

## What NOT to do
- Don't rely on interactive input to build state — the base interpreter has no
  `READ`/`INPUT` builtin. Use files or fixed data.
- Don't assume `SLEEP` works — probe first (see Time recipes).

## Principle
Persistence = **read file → decode → compute → encode → write file**. Every
persistent program is that loop.
