# String Recipes

## Get the first character
```nbs
LET s = "Nebulara"
PRINT CHAR_AT(s, 0)    # N
```

## Get the last character
```nbs
LET s = "Nebulara"
PRINT CHAR_AT(s, LEN(s) - 1)    # a
```

## First 3 characters and middle slice
```nbs
LET s = "Nebulara"
PRINT SUBSTR(s, 0, 3)      # Neb
PRINT SUBSTR(s, 2, 4)      # bula
```

## String length vs empty
```nbs
PRINT LEN("hello")    # 5
PRINT LEN("")         # 0
```

## Concatenate with a number
```nbs
LET score = 9000
PRINT "Score: " + score    # Score: 9000
```

## Uppercase / lowercase
```nbs
PRINT TO_UPPER("hello")    # HELLO
PRINT TO_LOWER("WORLD")    # world
```

## Trim whitespace
```nbs
PRINT "[" + TRIM("  hi  ") + "]"    # [hi]
```

## Capitalize the first letter
```nbs
FUNC! capitalize(s):
    IF? LEN(s) == 0:
        RETURN s
    END!
    LET first = TO_UPPER(CHAR_AT(s, 0))
    LET rest  = SUBSTR(s, 1, LEN(s) - 1)
    RETURN first + rest
END!
PRINT capitalize("nebulara")    # Nebulara
```

## Reverse a string
```nbs
FUNC! reverse(s):
    LET out = ""
    LET i = LEN(s) - 1
    WHILE? i >= 0:
        out = out + CHAR_AT(s, i)
        i = i - 1
    END!
    RETURN out
END!
PRINT reverse("abc")    # cba
```

## Character ↔ code
```nbs
PRINT ORD("A")        # 65
PRINT CHAR(65)        # A
PRINT CHAR(ORD("A") + 1)   # B   (shift a letter)
```

## Clean user input
**Problem:** trim + lowercase so comparisons are forgiving.
```nbs
LET raw = "  YeS  "
LET clean = TO_LOWER(TRIM(raw))
IF? clean == "yes":
    PRINT "got it"
END!
```

## Count occurrences of a character
```nbs
FUNC! count_char(s, target):
    LET n = 0
    LET i = 0
    WHILE? i < LEN(s):
        IF? CHAR_AT(s, i) == target:
            n = n + 1
        END!
        i = i + 1
    END!
    RETURN n
END!
PRINT count_char("banana", "a")    # 3
```
