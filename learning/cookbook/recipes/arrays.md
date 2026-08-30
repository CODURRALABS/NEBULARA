# Array Recipes

## Create & read
```nbs
LET a = [10, 20, 30]
PRINT a[0]    # 10
PRINT a[2]    # 30
```

## Length
```nbs
LET a = [1, 2, 3, 4]
PRINT LEN(a)    # 4
```

## Append / remove from the end
```nbs
LET s = [1, 2, 3]
PUSH(s, 4)              # [1,2,3,4]
PRINT POP(s)            # 4  (and s is back to 3)
PRINT POP(s)            # 3
```

## Safe pop (no crash on empty)
```nbs
FUNC! safe_pop(arr):
    IF? LEN(arr) == 0:
        RETURN NULL
    END!
    RETURN POP(arr)
END!
```

## Change an element
```nbs
LET a = [10, 20, 30]
a[1] = 99
PRINT a[1]    # 99
```

## Loop over every element
```nbs
LET a = ["x", "y", "z"]
LET i = 0
WHILE? i < LEN(a):
    PRINT a[i]
    i = i + 1
END!
```

## Sum
```nbs
FUNC! sum(arr):
    LET t = 0
    LET i = 0
    WHILE? i < LEN(arr):
        t = t + arr[i]
        i = i + 1
    END!
    RETURN t
END!
```

## Find the index of a value
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
```

## Does an array contain a value?
```nbs
FUNC! contains(arr, v):
    RETURN index_of(arr, v) >= 0
END!
PRINT contains([1,2,3], 2)    # true
```

## Copy (by value)
**Problem:** avoid sharing the same underlying array.
```nbs
FUNC! copy(arr):
    LET out = []
    LET i = 0
    WHILE? i < LEN(arr):
        PUSH(out, arr[i])
        i = i + 1
    END!
    RETURN out
END!
LET b = copy([1,2,3])
b[0] = 99
PRINT b[0]    # 99  (independent)
```

## Reverse in place
```nbs
FUNC! reverse(arr):
    LET i = 0
    LET j = LEN(arr) - 1
    WHILE? i < j:
        LET tmp = arr[i]
        arr[i] = arr[j]
        arr[j] = tmp
        i = i + 1
        j = j - 1
    END!
END!
LET x = [1,2,3]
reverse(x)
PRINT x[0]    # 3
```

## Build an array with a loop (run of 0..9)
```nbs
LET nums = []
LET i = 0
WHILE? i < 10:
    PUSH(nums, i)
    i = i + 1
END!
PRINT LEN(nums)    # 10
PRINT nums[9]      # 9
```

## Printing an array: the gotcha
```nbs
LET a = [1,2,3]
PRINT a    # [array 3]  -- count, not elements!
```
Use a loop (above) to print elements.
