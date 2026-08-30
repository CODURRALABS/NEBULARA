# Chapter 6 — Strings

> Book: *Nebulara From Zero* · Part II — The Language Spine

Text is everywhere in programs — messages, names, data. Nebulara gives you a
set of tools to build, measure, and reshape strings.

---

## Making strings

Strings are text inside **double quotes**:

```nbs
PRINT "hello"
PRINT "the quick brown fox"
PRINT ""          # empty string
```

---

## Joining strings with `+`

The `+` operator glues strings together (this is called **concatenation**):

```nbs
PRINT "hello" + " " + "world"
```
```
hello world
```

You can join variables too:
```nbs
LET first = "Jane"
LET last = "Doe"
PRINT first + " " + last
```
```
Jane Doe
```

---

## Automatic number conversion

When you add a number to a string, Nebulara converts it for you:

```nbs
PRINT "Score: " + 42
```
```
Score: 42
```

This is the easiest way to build readable output. But note: a string and a
number don't otherwise cooperate — `"5" + 5` becomes the string `"55"`, not
`10`. Use `TO_NUMBER` (Chapter 3) if you want arithmetic.

---

## Measuring strings with `LEN`

`LEN` returns how many characters (bytes) a string has:

```nbs
PRINT LEN("hello")    # 5
PRINT LEN("")         # 0
PRINT LEN("a b c")    # 5   (spaces count)
```

---

## Changing case

```nbs
PRINT TO_UPPER("hello")    # HELLO
PRINT TO_LOWER("WORLD")    # world
```

---

## Picking characters out

Remember: indexes start at **0** (the first character is position 0).

```nbs
LET s = "Nebulara"

PRINT CHAR_AT(s, 0)     # N
PRINT CHAR_AT(s, 3)     # u
PRINT CHAR_AT(s, 99)    # NULL   (out of range)
```

`CHAR_AT` returns a 1-character string, or `NULL` if the index is out of range.

---

## Slicing with `SUBSTR`

`SUBSTR(s, start, len)` returns a piece: `len` characters starting at `start`.

```nbs
LET s = "Nebulara"
PRINT SUBSTR(s, 0, 3)    # Neb
PRINT SUBSTR(s, 2, 4)    # bula
PRINT SUBSTR(s, 4, 99)   # lara   (clamped to the end)
```

It's safe — it won't run past the string's end.

---

## Cleaning up with `TRIM`

`TRIM` removes leading and trailing spaces, tabs, and newlines:

```nbs
PRINT "[" + TRIM("   hi   ") + "]"    # [hi]
```

Use it on user input to ignore accidental extra spaces.

---

## Characters and codes

Every character has a numeric **code**. Nebulara has two builtins:

- `ORD(s)` — the code of a string's first character.
- `CHAR(code)` — the character for a code.

```nbs
PRINT ORD("A")     # 65
PRINT CHAR(65)     # A
PRINT CHAR(ORD("A") + 3)    # D
```

You can do "character arithmetic" with these, like shifting letters.

---

## A small real example — a clean greeting

```nbs
LET raw_name = "   aLuMiNa  "
LET name = TRIM(TO_LOWER(raw_name))
LET cap = TO_UPPER(CHAR_AT(name, 0)) + SUBSTR(name, 1, LEN(name) - 1)
PRINT cap
```
```
Alumina
```

This trims, lowercases, then capitalizes the first letter — a common
"clean a name" pattern.

---

## Try it

1. Build `"Hello, " + name + "!"` where `name` is a variable.
2. Print the 2nd character of a word and its length.
3. Print `TRIM("   x  ")` wrapped in brackets to confirm.
4. Turn a lowercase word uppercase, and an uppercase word lowercase.

---

## Chapter takeaways

- Strings use double quotes; `+` concatenates and auto-converts numbers.
- `LEN` — length; indexes start at 0.
- `CHAR_AT` — one character (or `NULL`); `SUBSTR` — a slice (clamped).
- `TO_UPPER` / `TO_LOWER` / `TRIM` — reshape text.
- `ORD` / `CHAR` — go between characters and their numeric codes.

**Next:** [Chapter 7 — Arrays](07-arrays.md)
