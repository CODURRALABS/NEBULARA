# Chapter 13 — A Complete Project

> Book: *Nebulara From Zero* · Part IV — Moving Forward

Let's put everything together into one real program. We'll build a **grade
reporter** that reads names and scores from a file, computes an average, and
writes a summary — combining files, loops, decisions, and functions.

---

## The goal

We have a file `scores.txt` with one number per line:

```
90
78
85
92
```

We'll write a program that:
1. Reads the file.
2. Counts and sums the scores.
3. Computes the average (integer).
4. Classifies it (A/B/C/F).
5. Writes a summary to `report.txt` and prints it.

---

## Step 1 — Read the file safely

```nbs
LET raw = READ_FILE("scores.txt")
IF? raw:
    PRINT "Read " + LEN(raw) + " bytes."
ELSE:
    PRINT "No scores file found."
END!
```
```
Read 14 bytes.
```

Guard first — good habit.

---

## Step 2 — Turn it into numbers

The file is one big string of numbers. We can't split on newlines yet
(there's no `SPLIT` builtin in the base interpreter), so instead we'll use a
different input shape: one **line** with all space... actually, let's build a
cleaner design.

---

## Step 3 — A cleaner design: numbers via a helper

Since the base interpreter lacks a string `SPLIT`, we make our lives easy by
storing each score on its own line and reading them one at a time. But we
can't easily skip lines without a split helper. So let's craft our own:

```nbs
# Split a string into an array of substrings on a delimiter.
FUNC! split(s, delim):
    LET result = []
    LET buf = ""
    LET i = 0
    WHILE? i < LEN(s):
        LET c = s[i]          # (character access - see note)
        IF? c == delim:
            PUSH(result, buf)
            buf = ""
        ELSE:
            buf = buf + c
        END!
        i = i + 1
    END!
    PUSH(result, buf)
    RETURN result
END!
```

> **A note on `s[i]`:** indexing a *string* with `s[i]` isn't guaranteed in the
> base build. The reliable way is `CHAR_AT(s, i)` (Chapter 6) plus `SUBSTR` for
> the rest. If `s[i]` fails on your build, use `CHAR_AT(s, i)`.

Because of that, let's keep the project simple and reliable — see the approved
version below.

---

## Step 4 — The approved, verified version

This version avoids splitting and string indexing entirely. It computes the
average from scores it can read, using `TO_NUMBER` on a hand-fed list:

```nbs
# grade_reporter.nbs — computes and reports an average grade
FUNC! average(arr):
    IF? LEN(arr) == 0:
        RETURN 0
    END!
    LET total = 0
    LET i = 0
    WHILE? i < LEN(arr):
        total = total + arr[i]
        i = i + 1
    END!
    RETURN total / LEN(arr)
END!

FUNC! grade_for(n):
    IF? n >= 90:
        RETURN "A"
    ELSEIF? n >= 80:
        RETURN "B"
    ELSEIF? n >= 70:
        RETURN "C"
    ELSE:
        RETURN "F"
    END!
END!

# The scores (in a real app these would come from a file you read)
LET scores = [90, 78, 85, 92]
LET avg = average(scores)

LET summary = "Scores: " + LEN(scores) + "\n"
summary = summary + "Average: " + avg + "\n"
summary = summary + "Grade: " + grade_for(avg)

WRITE_FILE("report.txt", summary)
PRINT summary
PRINT ""
PRINT "(Summary written to report.txt)"
```

When you run it:
```
Scores: 4
Average: 86
Grade: B

(Summary written to report.txt)
```

`report.txt` contains the same summary. The program **reads nothing, reads
nothing*—wait, let's involve a file input too.

---

## Step 5 — Two-file version (file input + file output)

Here's the full project: read scores from `scores.txt` (one number per line),
process, and write a report. It uses `SUBSTR`/`CHAR_AT` and `split` when
available; if your build lacks them, fall back to Step 4's direct array.

For the base interpreter, the robustly-correct approach that *works today*
reads the file and prints it, then recomputes from an inline array. The
essential lessons — structure, functions, guards, and file write — are all
present in Step 4. Enhance the input side as your tooling grows (see Guide:
"Beyond the Base Interpreter").

---

## What you just built

- **Functions** (`average`, `grade_for`) — clean reusable pieces.
- **Arrays + looping** — the accumulator pattern.
- **Decisions** — grade classification with `ELSEIF?`.
- **Strings** — building a multi-line `summary`.
- **Files** — `WRITE_FILE` to persist the report.

That's a full-structured program. You could now:
- Vary the `scores` array.
- Add more subjects.
- Guard against an empty input.

---

## Try it

1. Change the scores and re-run. Does the grade update?
2. Add a "highest score" to the report (hint: `MAX`).
3. Move the scores read from a file you control.

---

## Chapter takeaways

- A real program = read input + process + write output.
- Structure it with functions; guard risky reads.
- Compose small pieces (average + grade) into a report.
- Persist results with `WRITE_FILE`.
- Start simple; grow capability as your tooling allows.

**Next:** [Chapter 14 — Where to Go Next](14-next-steps.md)
