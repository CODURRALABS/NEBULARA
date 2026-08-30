# Data Structures: Stack, Queue, Grid

## Stack (LIFO) with PUSH/POP
```nbs
LET stack = []
PUSH(stack, "a")
PUSH(stack, "b")
PUSH(stack, "c")
PRINT POP(stack)    # c
PRINT POP(stack)    # b
PRINT POP(stack)    # a
```

Safe pop:
```nbs
FUNC! safe_pop(arr):
    IF? LEN(arr) == 0:
        RETURN NULL
    END!
    RETURN POP(arr)
END!
```

### Use case: balanced parentheses check
```nbs
FUNC! is_balanced(s):
    LET stack = []
    LET i = 0
    WHILE? i < LEN(s):
        LET c = CHAR_AT(s, i)
        IF? c == "(":
            PUSH(stack, c)
        ELSEIF? c == ")":
            IF? LEN(stack) == 0:
                RETURN FALSE
            END!
            POP(stack)
        END!
        i = i + 1
    END!
    RETURN LEN(stack) == 0
END!
PRINT is_balanced("(a(b)c)")    # true
PRINT is_balanced("(a)b(")      # false
```

## Queue (FIFO) with a moving head
There's no built-in shift-from-front, so track an index:
```nbs
LET q = [10, 20, 30]
LET head = 0

# dequeue
LET item = q[head]
head = head + 1
PRINT item        # 10

# next dequeued item
PRINT q[head]     # 20
```
The `head` pointer advances; the array isn't rebuilt each time (cheap).

### Enqueue
```nbs
PUSH(q, 40)    # add to the back
```

## Set-like membership (using an array)
No built-in set in the base interpreter; emulate with an array + contains:
```nbs
FUNC! set_add(s, v):
    LET i = 0
    WHILE? i < LEN(s):
        IF? s[i] == v:
            RETURN                  # already present
        END!
        i = i + 1
    END!
    PUSH(s, v)
END!

LET tags = []
set_add(tags, "red")
set_add(tags, "red")     # deduplicated
set_add(tags, "blue")
PRINT LEN(tags)    # 2
```

## Grid (2D array)
```nbs
LET grid = [ [1,2], [3,4], [5,6] ]
PRINT grid[1][0]    # 3   (row 1, col 0)
```
Build a grid dynamically:
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

## Mini "map" via parallel arrays
Until `{}` maps land, keep keys and values as parallel arrays:
```nbs
LET keys = ["name", "age"]
LET vals = ["Ayush", 25]

FUNC! map_get(keys, vals, k):
    LET i = 0
    WHILE? i < LEN(keys):
        IF? keys[i] == k:
            RETURN vals[i]
        END!
        i = i + 1
    END!
    RETURN NULL
END!

PRINT map_get(keys, vals, "name")    # Ayush
```

## Choosing a structure
| Need | Use |
|------|-----|
| Last-in-first-out | Stack (`PUSH`/`POP`) |
| First-in-first-out | Array + head index |
| Unique members | Array + `set_add` |
| grid/tabular | 2D arrays |
| key/value | parallel arrays (until maps) |
