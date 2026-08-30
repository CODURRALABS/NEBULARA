# Lesson 06 — Loops

Loops repeat code. Nebulara has two: `WHILE?` and `FOR!`.

---

## 1. `WHILE?` — repeat while a condition holds

```nbs
LET i = 1
WHILE? i <= 5:
    PRINT i
    i = i + 1
END!
```
```
1
2
3
4
5
```

Pattern:
```nbs
WHILE? <condition>:
    <body, must change toward ending the loop>
END!
```
**Always change the condition's value inside the loop** — otherwise it never stops.

---

## 2. `FOR!` — counted loops

`FOR!` runs a fixed number of times:

```nbs
FOR! i = 1 TO 5:
    PRINT i
END!
```
```
1
2
3
4
5
```

Pattern:
```nbs
FOR! <var> = <start> TO <end>:
    <body>
END!
```

> `TO` is inclusive in the examples shipped with the language. If your loop is
> off by one, check whether your build is inclusive/exclusive and adjust.

---

## 3. `FOR!` with `STEP`

```nbs
FOR! i = 0 TO 20 STEP 5:
    PRINT i
END!
```
```
0
5
10
15
20
```

---

## 4. `BREAK` — exit the loop early

```nbs
LET i = 0
WHILE? TRUE:
    i = i + 1
    IF? i == 3:
        BREAK
    END!
    PRINT i
END!
PRINT "done at " + i
```
Prints `1`, `2` then stops — `BREAK` jumps out.

---

## 5. `CONTINUE` — skip to the next iteration

```nbs
FOR! i = 1 TO 5:
    IF? i == 3:
        CONTINUE
    END!
    PRINT i
END!
```
```
1
2
4
5
```
`CONTINUE` skips the rest of the body for `i == 3`.

---

## 6. Looping over arrays

Combine a `WHILE?` with `LEN` + index to walk an array:

```nbs
LET arr = [10, 20, 30]
LET i = 0
WHILE? i < LEN(arr):
    PRINT arr[i]
    i = i + 1
END!
```
```
10
20
30
```

(Some builds support `FOR! i = 0 TO LEN(arr) - 1` too — try both.)

---

## 7. Full example — sum of an array

```nbs
LET arr = [5, 10, 15, 20]
LET total = 0
LET i = 0
WHILE? i < LEN(arr):
    total = total + arr[i]
    i = i + 1
END!
PRINT total     # 50
```

---

## Try it

1. Print the numbers 1 through 10 using `FOR!`.
2. Print the even numbers up to 20 using `FOR! ... STEP 2`.
3. Write a `WHILE?` that counts down from 5 to 1.

```nbs
FOR! i = 1 TO 10:
    PRINT i
END!

FOR! i = 0 TO 20 STEP 2:
    PRINT i
END!

LET n = 5
WHILE? n >= 1:
    PRINT n
    n = n - 1
END!
```

---

## Exercises

1. Write a loop that prints `"x"` five times.
2. Using a loop, print the squares of 1..5 (1, 4, 9, 16, 25).
3. What does this print? (Watch the `CONTINUE`.)
```nbs
FOR! i = 1 TO 4:
    IF? i == 2:
        CONTINUE
    END!
    PRINT i
END!
```

### Answers
1.
```nbs
FOR! i = 1 TO 5:
    PRINT "x"
END!
```
2.
```nbs
FOR! i = 1 TO 5:
    PRINT i * i
END!
```
3. `1`, `3`, `4` (skips `2`)

---

## Checkpoint
- `WHILE?` and `FOR!` with `STEP`. ✅
- `BREAK` and `CONTINUE`. ✅
- Looping over arrays by index. ✅

Next: **[Lesson 07 — Functions](07-functions.md)**
