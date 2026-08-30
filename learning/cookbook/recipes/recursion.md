# Recursion Recipes

## The two rules
1. A **base case** that returns without recursing.
2. A step that moves **toward** the base case.

## Count down to zero
```nbs
FUNC! countdown(n):
    IF? n <= 0:
        PRINT "blast off"
        RETURN
    END!
    PRINT n
    countdown(n - 1)      # move toward base
END!
countdown(3)
```
```
3
2
1
blast off
```

## Factorial
```nbs
FUNC! factorial(n):
    IF? n <= 1:
        RETURN 1
    END!
    RETURN n * factorial(n - 1)
END!
PRINT factorial(5)    # 120
```

## Fibonacci
```nbs
FUNC! fib(n):
    IF? n <= 1:
        RETURN n
    END!
    RETURN fib(n - 1) + fib(n - 2)
END!
PRINT fib(10)    # 55
```
> `fib` gets slow for large `n` (exponential). For big inputs, prefer a loop.

## Sum an array (recursive)
```nbs
FUNC! sum(arr):
    IF? LEN(arr) == 0:
        RETURN 0
    END!
    RETURN arr[0] + sum(slice_from(arr, 1))
END!
```
(_See note below about building `/slice_from` — a slice helper is needed._)

## String length without LEN (recursive view)
```nbs
FUNC! mylen(s):
    IF? LEN(s) == 0:
        RETURN 0
    END!
    RETURN 1 + mylen(SUBSTR(s, 1, LEN(s) - 1))
END!
PRINT mylen("hello")    # 5
```

## Reverse a string (recursive)
```nbs
FUNC! rev(s):
    IF? LEN(s) == 0:
        RETURN ""
    END!
    RETURN rev(SUBSTR(s, 1, LEN(s) - 1)) + CHAR_AT(s, 0)
END!
PRINT rev("abc")    # cba
```

## GCD (Euclid)
```nbs
FUNC! gcd(a, b):
    IF? b == 0:
        RETURN a
    END!
    RETURN gcd(b, a % b)
END!
PRINT gcd(48, 18)    # 6
```

## Best practices
- **Always have a base case** — otherwise infinite recursion (stack overflow).
- **Mind the stack depth.** The base interpreter has a finite call stack;
  tens of thousands of frames can overflow. Use loops for large linear work.
- **Prefer loops for performance**; reach for recursion where it reads best
  and stays shallow.

## A loop version (for large inputs)
```nbs
FUNC! factorial_loop(n):
    LET result = 1
    LET i = 1
    WHILE? i <= n:
        result = result * i
        i = i + 1
    END!
    RETURN result
END!
```
