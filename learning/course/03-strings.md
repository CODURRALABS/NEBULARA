# Lesson 03 — Strings

Text is everywhere. Nebulara strings are double-quoted sequences of characters,
and the `+` operator concatenates them.

---

## 1. Concatenation with `+`

```nbs
LET first = "Hello"
LET space = " "
LET rest = "World"
PRINT first + space + rest     # Hello World
PRINT "a" + "b" + "c"          # abc
```

You can also concatenate a number onto a string — it's converted for you:
```nbs
PRINT "Count: " + 5            # Count: 5
```

---

## 2. Length — `LEN`

`LEN` returns the number of bytes (characters) in a string:

```nbs
PRINT LEN("hello")     # 5
PRINT LEN("")          # 0
```

---

## 3. Case — `TO_UPPER` / `TO_LOWER`

```nbs
PRINT TO_UPPER("hello")     # HELLO
PRINT TO_LOWER("WORLD")     # world
```

---

## 4. Picking apart a string — `CHAR_AT` & `SUBSTR`

Indexes are **0-based** (first character is at `0`):

```nbs
LET s = "Nebulara"
PRINT CHAR_AT(s, 0)      # N
PRINT CHAR_AT(s, 3)      # u
PRINT CHAR_AT(s, 99)     # NULL   (out of range)

PRINT SUBSTR(s, 0, 3)    # Neb
PRINT SUBSTR(s, 2, 4)    # bula
PRINT SUBSTR(s, 4, 99)   # lara   (clamped to end)
```

- `CHAR_AT(s, i)` — the 1-character string at index `i`, or `NULL` out of range.
- `SUBSTR(s, start, len)` — `len` characters starting at `start`, clamped to
  the string's bounds.

---

## 5. Whitespace — `TRIM`

`TRIM` removes leading and trailing spaces, tabs, and newlines:

```nbs
PRINT TRIM("   hi   ")     # hi
PRINT "[" + TRIM("  x  ") + "]"   # [x]
```

---

## 6. Between text and number — `CHAR` & `ORD`

- `ORD(s)` — the integer code point of the first character.
- `CHAR(code)` — the character for a code point.

```nbs
PRINT ORD("A")     # 65
PRINT ORD("Z")     # 90
PRINT CHAR(65)     # A
PRINT CHAR(97)     # a
```

Together they let you do character arithmetic:
```nbs
PRINT CHAR(ORD("A") + 3)     # D
```

---

## 7. Converting types — `TO_STRING` / `TO_NUMBER`

```nbs
PRINT TO_STRING(123)          # the string "123"
PRINT TO_NUMBER("42") + 1     # 43   (converted, then added)
PRINT TO_NUMBER("abc")        # 0    (not parseable)
```

---

## Combined example — a tiny name formatter

```nbs
LET raw = "  aLuMiNa  "
LET name = TRIM(TO_LOWER(raw))
LET cap = TO_UPPER(CHAR_AT(name, 0)) + SUBSTR(name, 1, LEN(name) - 1)
PRINT name        # alumina
PRINT cap         # Alumina
```

---

## Try it

1. Build a greeting that includes a name you store in a variable.
2. Print the 3rd character of a word, then its length.
3. Trim a padded string and tell us its trimmed length.

```nbs
LET word = "  nebula  "
PRINT TRIM(word)
PRINT LEN(TRIM(word))
```

---

## Exercises

1. What is `LEN("hello") + LEN("world")`?
2. Print `"hi"` in all uppercase and `"BYE"` in all lowercase.
3. Print the 5th character (index 4) of `"Nebulara"`.
4. Given `LET s = "abcdef"`, print the substring `"cde"`.

### Answers
1. `10`
2. `PRINT TO_UPPER("hi")`  and  `PRINT TO_LOWER("BYE")`
3. `PRINT CHAR_AT("Nebulara", 4)    # a`
4. `PRINT SUBSTR("abcdef", 2, 3)    # cde`

---

## Checkpoint
- `+` concatenates and converts numbers. ✅
- `LEN`, `TO_UPPER`, `TO_LOWER`, `TRIM`. ✅
- `CHAR_AT`, `SUBSTR`, `CHAR`, `ORD`. ✅

Next: **[Lesson 04 — Arrays](04-arrays.md)**
