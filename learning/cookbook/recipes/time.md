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

## A pseudo timer with RANDOM
No `SLEEP` in the base interpreter, but if you have the stdlib `time` module
and `SLEEP` works on your build, pause with:
```nbs
# stdlib: USE "time"  → time.sleep(ms)
```
Otherwise, simulate a delay by doing busy work (a big loop). This is not
precise wall-clock timing, just a delay.

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
`sleep(ms)` exists in the stdlib `time.nbs` module and as a `SLEEP` builtin in
source, but **is not wired into the base interpreter** — it raises an
undefined-function error. Check your build with a probe before relying on it:
```nbs
# probe.nbs
SLEEP(100)
```
If it errors, don't use it.

---

## The timer module (stdlib)
If your build supports `USE` and `sleep`:
```nbs
USE "time"
LET start = time.now()
# ... work ...
PRINT "elapsed: " + time.elapsed(start)
```
