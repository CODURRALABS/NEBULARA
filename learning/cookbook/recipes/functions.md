# Function Recipes

## Define and call
```nbs
FUNC! greet(name):
    PRINT "Hello, " + name
END!

greet("Ayush")    # Hello, Ayush
```

## Return a value
```nbs
FUNC! square(n):
    RETURN n * n
END!
PRINT square(5)    # 25
```

## Multiple parameters
```nbs
FUNC! rectangle_area(w, h):
    RETURN w * h
END!
PRINT rectangle_area(4, 5)    # 20
```

## Default-ish behavior (fallback)
**Problem:** a "missing parameter" fallback via a guarded helper.
```nbs
FUNC! read_or(fname, default):
    LET raw = READ_FILE(fname)
    IF? raw:
        RETURN raw
    END!
    RETURN default
END!
PRINT read_or("missing.txt", "nothing")
```

## Early return (exit before the end)
```nbs
FUNC! classify(n):
    IF? n < 0:
        RETURN "negative"
    END!
    RETURN "non-negative"
END!
```

## Return a bool
```nbs
FUNC! is_adult(age):
    RETURN age >= 18
END!
PRINT is_adult(21)    # true
```

## Compose functions
```nbs
FUNC! double(n): RETURN n * 2 END!
FUNC! add_tax(n): RETURN n + n / 10 END!
PRINT add_tax(double(100))    # 220
```

## A function over arrays (helper)
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
PRINT sum([1,2,3,4])    # 10
```

## Guarding inside a function
```nbs
FUNC! average(arr):
    IF? LEN(arr) == 0:
        RETURN 0
    END!
    RETURN sum(arr) / LEN(arr)
END!
PRINT average([])    # 0  (no divide-by-zero)
```

## Parameter passing: values vs arrays
Values copy; arrays share the caller's array:
```nbs
FUNC! mutate(arr):
    PUSH(arr, 99)
END!
LET a = [1]
mutate(a)
PRINT LEN(a)    # 2   (the caller's array changed)
```
To avoid surprises, `copy` the array before mutating (see Array recipes).

## Name your functions well
Prefer verbs + nouns: `compute_total`, `load_config`, `safe_pop`. One purpose
each. Keep bodies short enough to read in one screen.

## Notes
- `RETURN` stops execution immediately.
- Closures / storing a function in a variable are `[planned]` (v4), not in the
  base interpreter.
