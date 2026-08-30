# Chapter 9 — Repeating Work

> Book: *Nebulara From Zero* · Part II — The Language Spine

Writing the same code again and again is wasteful (and error-prone). **Loops**
let you repeat a block of code — a fixed number of times, or while a condition
holds.

---

## `WHILE?` — repeat while a condition is true

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

The loop checks `i <= 5`. As long as that's `TRUE`, the body runs. Critically,
the body must **change the condition** — here `i = i + 1` moves `i` toward 5.
Without a change, the loop never ends (an **infinite loop** — a real bug!).

---

## `FOR!` — a counted loop

When you know how many times to repeat, `FOR!` is cleaner:

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
    ...
END!
```
`FOR!` sets up the variable, repeats, and updates it for you — you don't
manage the increment by hand.

---

## `FOR!` with `STEP`

Control the step size:

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

## `BREAK` — leave early

`BREAK` jumps out of the loop immediately:

```nbs
LET i = 0
WHILE? TRUE:
    i = i + 1
    IF? i == 3:
        BREAK
    END!
    PRINT i
END!
PRINT "stopped at " + i
```
```
1
2
stopped at 3
```

Here `WHILE? TRUE` would run forever, but `BREAK` exits when `i` reaches 3.

---

## `CONTINUE` — skip an iteration

`CONTINUE` skips the rest of the current pass and starts the next:

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
`3` is skipped, but the loop keeps going.

---

## Looping over arrays

This is one of the most common things loops do — visit every element:

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

The pattern `i < LEN(arr)` together with `i = i + 1` walks the whole array.

---

## Summing an array

```nbs
LET arr = [5, 10, 15, 20]
LET total = 0
LET i = 0
WHILE? i < LEN(arr):
    total = total + arr[i]
    i = i + 1
END!
PRINT total    # 50
```

This—"start total at 0, add each element"—is the classic **accumulator** pattern
you'll use constantly.

---

## A practical example — a countdown

Count *down* reliably with a `WHILE?` (verified; the `FOR!` with a negative
`STEP` doesn't run on the current build):

```nbs
LET i = 5
WHILE? i >= 1:
    PRINT i
    i = i - 1
END!
PRINT "Blast off!"
```
```
5
4
3
2
1
Blast off!
```
*(A `FOR! i = 5 TO 1 STEP -1` silently does nothing in the current build —*
*use the `WHILE?` form for countdowns.)*

---

## Try it

1. Print the numbers 1 to 10 with a `FOR!`.
2. Print even numbers up to 20.
3. Sum `[1, 2, 3, 4, 5]` with a loop (expect 15).
4. Print each element of `["a", "b", "c"]` using a `WHILE?`.

---

## Chapter takeaways

- `WHILE?` repeats while a condition holds; change the condition or loop forever.
- `FOR!` counts; `STEP` controls the increment.
- `BREAK` exits a loop; `CONTINUE` skips one iteration.
- Loop over arrays with `i < LEN(arr)` and `i = i + 1`.
- Accumulator pattern: `total = total + x`.

**Next:** [Chapter 10 — Functions](10-functions.md)
