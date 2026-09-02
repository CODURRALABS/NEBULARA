# Time Recipes

## Get the current time
```nbs
LET now = TIME()
PRINT now
```
`TIME()` returns the current time value (epoch-style). Print it to see the
number; store and diff to measure elapsed time.

## Measure how long something takes
```nbs
LET start = TIME()

# ... do some work (e.g. a loop) ...
LET i = 0
WHILE? i < 10000:
    i = i + 1
END!

LET elapsed = TIME() - start
PRINT "elapsed: " + elapsed
```

## A pseudo timer
`SLEEP(ms)` is implemented in the current source (`Compiler/nbs-bootstrap.c`),
and the stdlib `time` module wraps it. Pause with:
```nbs
SLEEP(100)   # wait 100 ms
```
If a shipped `.exe` errors on it, rebuild from source to get `SLEEP`.

## Timestamp-ish value for logging
```nbs
LET stamp = TIME()
WRITE_FILE("log.txt", "event at " + stamp)
```
Concatenating `"event at " + stamp` auto-converts the number to text.

## Guard: TIME as a random seed
Use the current time to get variety between runs:
```nbs
LET seed = TIME()
# (A future build could seed RANDOM with this.)
PRINT seed
```

## Note on `SLEEP`
`SLEEP(ms)` is implemented in the current source (`Compiler/nbs-bootstrap.c`).
If your shipped `.exe` raises an undefined-function error for it, rebuild from
source. Confirm with a probe:
```nbs
# probe.nbs
SLEEP(100)
```
If it errors, your binary is older than the source — rebuild.

---

## The timer module (stdlib)
Use `IMPORT` to load the time module, then call its functions directly:
```nbs
IMPORT "std/time.nbs"
LET start = now()
# ... work ...
PRINT "elapsed: " + elapsed(start)
```
