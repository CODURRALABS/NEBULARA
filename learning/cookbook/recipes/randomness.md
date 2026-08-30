# Randomness Recipes

## A single random int (0..99)
```nbs
PRINT RANDOM()
```

## Random in a range (inclusive)
```nbs
FUNC! rand_range(lo, hi):
    RETURN lo + RANDOM() % (hi - lo + 1)
END!
PRINT rand_range(1, 6)    # like a die
```

## Simulate a coin flip
```nbs
FUNC! coin():
    IF? RANDOM() % 2 == 0:
        RETURN "heads"
    END!
    RETURN "tails"
END!
PRINT coin()
```

## Pick a random element from an array
```nbs
FUNC! choice(arr):
    IF? LEN(arr) == 0:
        RETURN NULL
    END!
    RETURN arr[RANDOM() % LEN(arr)]
END!
PRINT choice(["red", "green", "blue"])
```

## Shuffle an array (Fisher–Yates style)
```nbs
FUNC! shuffle(arr):
    LET i = LEN(arr) - 1
    WHILE? i > 0:
        LET j = RANDOM() % (i + 1)
        LET tmp = arr[i]
        arr[i] = arr[j]
        arr[j] = tmp
        i = i - 1
    END!
END!
LET deck = [1,2,3,4,5,6]
shuffle(deck)
PRINT deck[0]
```

## Random string of length n (letters only)
```nbs
FUNC! rand_string(n):
    LET out = ""
    LET i = 0
    WHILE? i < n:
        LET code = 97 + RANDOM() % 26       # 'a'=97 .. 'z'
        out = out + CHAR(code)
        i = i + 1
    END!
    RETURN out
END!
PRINT rand_string(8)
```

## Number-guessing set-up (no interactive input yet)
Since the base interpreter lacks interactive `READ`, drive guesses from a file
or a fixed sequence. Here's the check logic you'd call repeatedly:
```nbs
LET secret = rand_range(1, 10)
LET guess = 5
IF? guess == secret:
    PRINT "correct"
ELSEIF? guess < secret:
    PRINT "too low"
ELSE:
    PRINT "too high"
END!
```

## Dice + sum (a tiny game roll)
```nbs
FUNC! d6():
    RETURN 1 + RANDOM() % 6
END!
PRINT "Roll: " + d6()
```
