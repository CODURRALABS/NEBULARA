# Chapter 2 — Advanced Data: stacking, slicing, and structures

> Book: *Beyond the Bases* · Part I — Idiomatic Nebulara

The base interpreter gives you ints, strings, bools, null, and arrays. This
chapter makes the most of those — and looks at what richer structures are
planned.

---

## The stack: LIFO with `PUSH` / `POP`

A **stack** is "last in, first out." `PUSH` adds to the top; `POP` removes the
top. This is ideal for undo history, parentheses matching, or traversal:

```nbs
LET stack = []
PUSH(stack, "a")
PUSH(stack, "b")
PUSH(stack, "c")
PRINT POP(stack)    # c
PRINT POP(stack)    # b
PRINT POP(stack)    # a
PRINT POP(stack)    # NULL  (empty - guard with LEN)
```

Always guard `POP` on a possibly-empty array:
```nbs
FUNC! safe_pop(arr, fallback):
    IF? LEN(arr) == 0:
        RETURN fallback
    END!
    RETURN POP(arr)
END!
```

---

## Arrays as queues (FIFO)

There's no builtin "shift from the front," but you can emulate a queue with an
index pointer so you never re-shift the whole array:

```nbs
LET q = [10, 20, 30]
LET head = 0
# "dequeue":
LET item = q[head]
head = head + 1
PRINT item     # 10
PRINT q[head]  # 20
```

Tracking a moving `head` is cheaper than rebuilding the array each time.

---

## Slicing and windows

`SUBSTR` slices strings. For arrays, slice by reading a range of indices into
a new array:

```nbs
FUNC! slice(arr, start, count):
    LET out = []
    LET i = start
    LET end = start + count
    IF? end > LEN(arr):
        end = LEN(arr)
    END!
    WHILE? i < end:
        PUSH(out, arr[i])
        i = i + 1
    END!
    RETURN out
END!

LET nums = [0, 1, 2, 3, 4, 5]
PRINT LEN(slice(nums, 2, 3))   # 3  -> [2, 3, 4]
```

Writing small data helpers like `slice`, `reverse`, and `contains` is a great
way to build your personal library — see the Cookbook.

---

## Two-dimensional arrays

Arrays can hold arrays, which gives you grids:

```nbs
LET grid = [ [1, 2], [3, 4], [5, 6] ]
PRINT grid[1][0]    # 3   (row 1, column 0)
```

Access is `grid[row][col]`. Build grids row by row:

```nbs
LET rows = 3
LET cols = 2
LET board = []
LET r = 0
WHILE? r < rows:
    LET row = []
    LET c = 0
    WHILE? c < cols:
        PUSH(row, r * cols + c)
        c = c + 1
    END!
    PUSH(board, row)
    r = r + 1
END!
PRINT board[2][1]    # 5
```

---

## Searching

A linear search returns the index (or `-1`/`NULL` to mean "not found"):

```nbs
FUNC! index_of(arr, needle):
    LET i = 0
    WHILE? i < LEN(arr):
        IF? arr[i] == needle:
            RETURN i
        END!
        i = i + 1
    END!
    RETURN -1
END!

PRINT index_of(["a", "b", "c"], "b")    # 1
PRINT index_of(["a", "b", "c"], "z")    # -1
```

---

## Sorting (you'd implement it)

There's no builtin `SORT` in the base interpreter. A simple bubble sort is a
fine idiom and a good exercise — see the Cookbook for a full implementation.
The interpreter's own array operations (mask-based, in the C source) support
mask/slice operations that more capable builds expose.

---

## Maps? Not yet — but planned

The v4 spec introduces a **map** type — key/value objects:

```nbs
# v4-only, NOT in the base interpreter:
LET user = { "name": "Ayush", "age": 25 }
PRINT user["name"]
```

The base interpreter **does not** parse `{}`. Until maps land, you have two
idioms:

1. **Parallel arrays** — keep a `keys` array and a `values` array, index by the
   key's position in `keys`.
2. **String keys + encoding** — for small maps, encode as
   `"name=Ayush|age=25"` and parse with `split`-style helpers.

Floats are likewise planned but absent in the base integer runtime.

---

## Summary

- `PUSH`/`POP` give you a stack; guard `POP` on empties.
- Emulate a queue with a moving head index.
- Write your own array helpers: `slice`, `index_of`, `reverse`, `sort`.
- Nest arrays for grids (`arr[row][col]`).
- Maps and floats are v4 — parallel arrays and string encoding stand in today.

**Next:** [Chapter 3 — The Guard Paradigm Done Right](03-guards.md)
