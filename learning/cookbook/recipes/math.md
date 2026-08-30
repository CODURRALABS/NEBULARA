# Math Recipes

## Integer division and remainder
**Problem:** divide and know the remainder.
```nbs
PRINT 17 / 3    # 5  (integer division, truncates)
PRINT 17 % 3    # 2  (remainder)
```

## Absolute value
```nbs
PRINT ABS(-42)    # 42
```

## Clamp a value into a range
**Problem:** keep `v` between `lo` and `hi`.
```nbs
FUNC! clamp(v, lo, hi):
    IF? v < lo:
        RETURN lo
    ELSEIF? v > hi:
        RETURN hi
    ELSE:
        RETURN v
    END!
END!
PRINT clamp(15, 0, 10)    # 10
```

## Is a number even?
```nbs
FUNC! is_even(n):
    RETURN n % 2 == 0
END!
PRINT is_even(10)    # true
PRINT is_even(7)     # false
```

## Integer square root
```nbs
PRINT SQRT(16)    # 4
PRINT SQRT(17)    # 4  (truncated)
```

## Powers
```nbs
PRINT POW(2, 10)    # 1024
```

## Random integer in a range
```nbs
FUNC! rand_range(lo, hi):
    RETURN lo + RANDOM() % (hi - lo + 1)
END!
PRINT rand_range(1, 6)    # 1..6
```

## Min / max of two
```nbs
PRINT MIN(3, 9)    # 3
PRINT MAX(3, 9)    # 9
```

## Sum and average of an array
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

FUNC! average(arr):
    IF? LEN(arr) == 0:
        RETURN 0
    END!
    RETURN sum(arr) / LEN(arr)
END!

PRINT sum([1,2,3,4])      # 10
PRINT average([2,4,6])    # 4
```

## Keep it safe
Guard against division by a value that could be zero:
```nbs
FUNC! percent(part, whole):
    IF? whole == 0:
        RETURN 0          # avoid divide-by-zero
    END!
    RETURN part * 100 / whole
END!
PRINT percent(25, 200)    # 12
```
