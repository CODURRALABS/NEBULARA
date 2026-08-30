# Lesson 04 — Arrays

An array is an ordered list of values. Nebulara arrays can be read by index,
mutated in place, and grown with `PUSH`/`POP`.

---

## 1. Creating arrays

```nbs
LET arr = [10, 20, 30]
LET fruits = ["apple", "banana", "cherry"]
LET mixed = [1, "two", TRUE, NULL]    # any types
LET empty = []
```

---

## 2. Reading by index (0-based)

```nbs
LET arr = [10, 20, 30]
PRINT arr[0]     # 10
PRINT arr[1]     # 20
PRINT arr[2]     # 30
```

---

## 3. Length — `LEN`

```nbs
LET arr = [10, 20, 30]
PRINT LEN(arr)     # 3
```

---

## 4. Mutating in place

Change an element by assigning to its index — **this modifies the original
array**:

```nbs
LET arr = [10, 20, 30]
arr[1] = 99
PRINT arr[1]       # 99
```

---

## 5. Appending & removing — `PUSH` / `POP`

```nbs
LET arr = [1, 2, 3]

PUSH(arr, 4)       # append 4 -> [1,2,3,4]
PRINT LEN(arr)     # 4

LET last = POP(arr)   # last = 4, arr = [1,2,3]
PRINT last         # 4
PRINT LEN(arr)     # 3
```

- `PUSH(arr, value)` — adds to the **end**, modifies `arr`.
- `POP(arr)` — removes and returns the **last** element (`NULL` if empty).

---

## 6. The gotcha — printing an array

`PRINT arr` does **not** show the element list in this build. It shows the
count:

```nbs
LET arr = [10, 20, 30]
PRINT arr          # [array 3]
```

To print the *contents*, print each element in a loop (you'll learn loops next
lesson) or use the stdlib's helpers.

---

## 7. Numbers in strings

Combining arrays with the length is common:
```nbs
LET arr = [5, 6, 7]
PRINT "size is " + LEN(arr)    # size is 3
```

---

## Combined example

```nbs
LET scores = [90, 85, 78]
PUSH(scores, 92)
scores[0] = 95
PRINT "high = " + scores[0]      # high = 95
PRINT "count = " + LEN(scores)   # count = 4
POP(scores)
PRINT "after pop = " + LEN(scores)   # after pop = 3
```

---

## Try it

1. Create an array of your three favorite foods.
2. Print the second one.
3. Replace it, append a fourth, print the new length.

```nbs
LET foods = ["pizza", "ramen", "sushi"]
PRINT foods[1]        # ramen
foods[1] = "tacos"
PUSH(foods, "curry")
PRINT LEN(foods)      # 4
```

---

## Exercises

1. What does `PRINT [1,2,3][0]` print? *(hint: it's an indexed read of a literal — but for clarity use a variable)*
2. Create `[7, 8, 9]`, append `10`, then pop. What's the final length?
3. Print the last element of `[4, 5, 6]` using `POP`.

### Answers
1. `1`
2. 3 (append makes 4, pop makes 3)
3. `PRINT POP([4,5,6])    # 6` — but note this consumes the array; better to store it first in real code.

---

## Checkpoint
- Create arrays with `[...]`. ✅
- Read/write by index, know indexes are 0-based. ✅
- `PUSH`/`POP`/`LEN`. ✅
- Know `PRINT arr` shows the count, not elements. ✅

Next: **[Lesson 05 — Conditionals](05-conditionals.md)**
