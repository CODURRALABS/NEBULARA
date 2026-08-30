# Searching Recipes

## Linear search (index or -1)
```nbs
FUNC! index_of(arr, v):
    LET i = 0
    WHILE? i < LEN(arr):
        IF? arr[i] == v:
            RETURN i
        END!
        i = i + 1
    END!
    RETURN -1
END!

PRINT index_of(["a","b","c"], "b")    # 1
PRINT index_of(["a","b","c"], "z")    # -1
```

## Contains
```nbs
FUNC! contains(arr, v):
    LET i = 0
    WHILE? i < LEN(arr):
        IF? arr[i] == v:
            RETURN TRUE
        END!
        i = i + 1
    END!
    RETURN FALSE
END!
```

## Count occurrences
```nbs
FUNC! count(arr, v):
    LET n = 0
    LET i = 0
    WHILE? i < LEN(arr):
        IF? arr[i] == v:
            n = n + 1
        END!
        i = i + 1
    END!
    RETURN n
END!
PRINT count([1,2,1,1,3], 1)    # 3
```

## Find the first even number
```nbs
FUNC! first_even(arr):
    LET i = 0
    WHILE? i < LEN(arr):
        IF? arr[i] % 2 == 0:
            RETURN arr[i]
        END!
        i = i + 1
    END!
    RETURN NULL
END!
PRINT first_even([7, 3, 4, 9])    # 4
```

## Find the max / min (linear)
```nbs
FUNC! find_max(arr):
    IF? LEN(arr) == 0:
        RETURN NULL
    END!
    LET m = arr[0]
    LET i = 1
    WHILE? i < LEN(arr):
        IF? arr[i] > m:
            m = arr[i]
        END!
        i = i + 1
    END!
    RETURN m
END!
PRINT find_max([3, 9, 2])    # 9
```

## Binary search (sorted array)
See the Sorting recipes for `binary_search(arr, v)` — O(log n) but requires a
sorted array.

## Search a grid (2D)
```nbs
FUNC! find_in_grid(grid, v):
    LET r = 0
    WHILE? r < LEN(grid):
        LET c = 0
        WHILE? c < LEN(grid[r]):
            IF? grid[r][c] == v:
                RETURN [r, c]
            END!
            c = c + 1
        END!
        r = r + 1
    END!
    RETURN NULL
END!

LET g = [ [1,2], [3,4], [5,6] ]
LET pos = find_in_grid(g, 4)
PRINT pos[0]    # 1
PRINT pos[1]    # 1
```

## Know your conventions
Decide and document what "not found" means:
- Index searches return `-1`.
- Value searches return `NULL`.
Keep it consistent across your whole program.
