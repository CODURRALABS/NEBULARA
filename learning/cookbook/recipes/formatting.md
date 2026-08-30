# Formatting & Tables

## Pad a number/string to a width (right)
```nbs
FUNC! pad_right(s, w):
    LET out = s
    WHILE? LEN(out) < w:
        out = out + " "
    END!
    RETURN out
END!
PRINT "[" + pad_right("ab", 5) + "]"    # [ab   ]
```

## Pad left
```nbs
FUNC! pad_left(s, w):
    LET out = s
    WHILE? LEN(out) < w:
        out = " " + out
    END!
    RETURN out
END!
PRINT "[" + pad_left("7", 3) + "]"    # [  7]
```

## Repeat a character
```nbs
FUNC! repeat_char(c, n):
    LET out = ""
    LET i = 0
    WHILE? i < n:
        out = out + c
        i = i + 1
    END!
    RETURN out
END!
PRINT repeat_char("-", 5)    # -----
```

## Build a simple table
**Problem:** print aligned rows of names+scores.
```nbs
FUNC! pad_right(s, w):
    LET out = s
    WHILE? LEN(out) < w:
        out = out + " "
    END!
    RETURN out
END!

FUNC! print_table(names, scores):
    LET i = 0
    WHILE? i < LEN(names):
        PRINT pad_right(names[i], 12) + scores[i]
        i = i + 1
    END!
END!

LET names  = ["Ana", "Bob", "Cid"]
LET scores = [98, 85, 91]
print_table(names, scores)
```
```
Ana          98
Bob          85
Cid          91
```

## A divider line
```nbs
PRINT repeat_char("=", 20)
```
```
====================
```

## Numbers padded for leading zeros
```nbs
FUNC! two_digits(n):
    IF? n < 10:
        RETURN "0" + n
    END!
    RETURN TO_STRING(n)
END!
PRINT two_digits(7)    # "07"
PRINT two_digits(12)   # "12"
```

## A small report (multi-line build + write)
```nbs
FUNC! pad_right(s, w):
    LET out = s
    WHILE? LEN(out) < w:
        out = out + " "
    END!
    RETURN out
END!

FUNC! make_report(name, score):
    LET lines = "Report for " + name + "\n"
    lines = lines + pad_right("Score", 10) + score + "\n"
    RETURN lines
END!

WRITE_FILE("report.txt", make_report("Ana", 98))
PRINT READ_FILE("report.txt")
```

## Notes
- The stdlib `fmt.nbs` provides `pad_left`, `pad_right`, `repeat_char`, and
  `fmt(s, ...)` if your build supports `USE`.
- Strings + numbers concatenate automatically, which makes building lines easy.
- For monospaced alignment, pad with spaces; counts are in characters (bytes).
