# The Nebulara Cookbook

Short, task-based recipes. Each entry answers one question — "how do I do X in
Nebulara?" — with a copy-paste solution. All recipes use **verified** features
and the guard idiom so they work on the current interpreter.

---

## Recipe index

### Basics
- [Numbers & math](recipes/math.md)
- [Strings](recipes/strings.md)
- [Arrays](recipes/arrays.md)
- [Randomness](recipes/randomness.md)
- [Time](recipes/time.md)

### Structure
- [Functions](recipes/functions.md)
- [Recursion](recipes/recursion.md)

### Real world
- [Files: read, write, append](recipes/files.md)
- [Persistence & counters](recipes/persistence.md)

### Algorithms
- [Sorting](recipes/sorting.md)
- [Searching](recipes/searching.md)
- [Data structures: stack, queue, grid](recipes/data-structures.md)

### Output
- [Formatting & tables](recipes/formatting.md)

---

## Recipe format

Every recipe has:
- **Problem** — what you want to do.
- **Solution** — a short `.nbs` block.
- **Notes** — caveats and variations.

Feel free to adapt. All code here is meant to be understood, then modified for
your use — that's the point of a cookbook.

---

## Quick reference

```nbs
# The three most useful patterns

# 1. Guard a risky read
LET data = READ_FILE("file.txt")
IF? NOT data:
    PRINT "no file"
END!

# 2. Safe array tail
FUNC! safe_pop(arr):
    IF? LEN(arr) == 0:
        RETURN NULL
    END!
    RETURN POP(arr)
END!

# 3. Accumulate
LET t = 0
LET i = 0
WHILE? i < LEN(arr):
    t = t + arr[i]
    i = i + 1
END!
```

Browse by category with the links above, or start with
[Math](recipes/math.md).
