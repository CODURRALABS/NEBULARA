# Sorting Recipes

## Bubble sort (ascending)
**Problem:** sort an array of numbers, smallest first.
```nbs
FUNC! sort(arr):
    LET n = LEN(arr)
    LET i = 0
    WHILE? i < n - 1:
        LET j = 0
        WHILE? j < n - 1 - i:
            IF? arr[j] > arr[j + 1]:
                LET tmp = arr[j]
                arr[j] = arr[j + 1]
                arr[j + 1] = tmp
            END!
            j = j + 1
        END!
        i = i + 1
    END!
END!

LET arr = [5, 2, 9, 1]
sort(arr)
PRINT arr[0]    # 1
PRINT arr[1]    # 2
PRINT arr[2]    # 5
PRINT arr[3]    # 9
```
> Bubble sort is clear but O(n²). Fine for small arrays; for big ones you'd
> implement merge/quick sort or use the stdlib `sort.nbs` if available.

## Find the minimum / maximum
```nbs
FUNC! find_min(arr):
    IF? LEN(arr) == 0:
        RETURN NULL
    END!
    LET m = arr[0]
    LET i = 1
    WHILE? i < LEN(arr):
        IF? arr[i] < m:
            m = arr[i]
        END!
        i = i + 1
    END!
    RETURN m
END!

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

## Sort strings (by character comparison)
Strings compare with `<`/`>`; the bubble code above works for strings too if
you exchange the comparison values. The stdlib `sort.nbs` provides
`sort_strings(arr)`.

## Binary search on a sorted array
**Problem:** quickly find an index in a sorted array.
```nbs
FUNC! binary_search(arr, v):
    LET lo = 0
    LET hi = LEN(arr) - 1
    WHILE? lo <= hi:
        LET mid = (lo + hi) / 2
        IF? arr[mid] == v:
            RETURN mid
        ELSEIF? arr[mid] < v:
            lo = mid + 1
        ELSE:
            hi = mid - 1
        END!
    END!
    RETURN -1
END!

LET sorted = [1, 3, 5, 7, 9]
PRINT binary_search(sorted, 7)    # 3
PRINT binary_search(sorted, 4)    # -1
```
(Assumes `sorted` is already sorted ascending.)

## Smallest → largest helper (uses sort in place)
```nbs
sort(arr)
PRINT arr[0]              # smallest
PRINT arr[LEN(arr) - 1]   # largest
```
