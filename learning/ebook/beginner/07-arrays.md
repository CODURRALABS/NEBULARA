# Chapter 7 — Arrays

> Book: *Nebulara From Zero* · Part II — The Language Spine

An array is an **ordered list** of values. If a variable is one box, an array
is a whole shelf of boxes you can number and rearrange.

---

## Creating arrays

Use square brackets with commas inside:

```nbs
LET nums = [10, 20, 30]
LET fruits = ["apple", "banana"]
LET mixed = [1, "two", TRUE]      # any types
LET empty = []
```

---

## Reading by index

Indexes start at **0** — the first element is `arr[0]`:

```nbs
LET nums = [10, 20, 30]
PRINT nums[0]     # 10
PRINT nums[1]     # 20
PRINT nums[2]     # 30
```

---

## Array length with `LEN`

`LEN` works on arrays too, giving the element count:

```nbs
LET nums = [10, 20, 30]
PRINT LEN(nums)     # 3
```

---

## Changing elements

Assign to an index to change *that element in place*:

```nbs
LET nums = [10, 20, 30]
nums[1] = 99
PRINT nums[1]     # 99
```

The array is now `[10, 99, 30]`.

---

## Growing: `PUSH` and `POP`

- `PUSH(arr, value)` — append to the **end**.
- `POP(arr)` — remove & return the **last** element.

```nbs
LET stack = [1, 2, 3]
PUSH(stack, 4)          # now [1, 2, 3, 4]
PRINT LEN(stack)        # 4

LET last = POP(stack)   # last = 4
PRINT last              # 4
PRINT LEN(stack)        # 3   (back to [1, 2, 3])
```

`POP` on an empty array returns `NULL`. This push/pop pattern is the classic
**stack** — a "last in, first out" structure.

---

## The gotcha: printing an array

Watch out — `PRINT nums` does **not** show the elements:

```nbs
PRINT nums    # [array 3]   <- it shows the count, not the list
```

That's a quirk of the current build. To see the contents, you print each one
(you'll loop in Chapter 9) or use a helper.

---

## Combining with strings

You'll often mix arrays and numbers in messages:

```nbs
LET scores = [90, 85, 78]
PRINT "3rd score: " + scores[2]    # 3rd score: 78*
PRINT "count: " + LEN(scores)      # count: 3
```
*assuming you want the third element (index 2).*

---

## A practical example — a to-do list

```nbs
LET todo = []
PUSH(todo, "learn Nebulara")
PUSH(todo, "build a project")
PUSH(todo, "publish it")

PRINT "first task: " + todo[0]
PRINT "tasks: " + LEN(todo)

todo[1] = "build a bigger project"
POP(todo)
PRINT "after finishing one: " + LEN(todo)
```
```
first task: learn Nebulara
tasks: 3
after finishing one: 2
```

---

## Try it

1. Make an array of your three favorite foods. Print the middle one.
2. Replace the middle one, append a fourth, print the new length.
3. Use `POP` to remove and print the last element.

---

## Chapter takeaways

- Arrays: `[a, b, c]`; indexes from 0.
- Read/write with `arr[i]`; mutates in place.
- `LEN`, `PUSH` (append), `POP` (remove-last, or `NULL` if empty).
- `PRINT arr` shows the count, not the elements.

**Next:** [Chapter 8 — Making Decisions](08-decisions.md)
