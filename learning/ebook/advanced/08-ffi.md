# Chapter 8 — Calling C with FFI

> Book: *Beyond the Bases* · Part III — Going Universal

The **Foreign Function Interface (FFI)** lets Nebulara call native C functions
directly. This unlocks the entire C ecosystem — and is the mechanism that makes
the "universal" claim concrete at the ABI level.

---

## The three builtins

Nebulara exposes FFI through three builtins:

| Builtin | Purpose |
|---------|---------|
| `FFI_LOAD("lib")` | Load a shared library / DLL by name |
| `FFI_REGISTER(handle, "name", "sig")` | Look up a function by name |
| `FFI_CALL(reg, args...)` | Call it |

---

## A working example (Windows / msvcrt)

Load the C runtime, register `pow`, and call it:

```nbs
LET lib = FFI_LOAD("msvcrt")
LET power = FFI_REGISTER(lib, "pow", "dd->d")
LET result = FFI_CALL(power, 2.0, 10.0)
PRINT result
```

Interpretation:
- `FFI_LOAD("msvcrt")` opens the Microsoft C runtime DLL.
- `FFI_REGISTER(..., "pow", "dd->d")` finds `pow`, with a type signature
  `dd->d` (two doubles in, one double out).
- `FFI_CALL(power, 2.0, 10.0)` invokes it → `1024.0`.

---

## The signature mini-language

`FFI_REGISTER` needs a signature string so Nebulara knows how to pass data.
The convention is `<in-types>-><return-type>`:

| Letter | C type |
|--------|--------|
| `i` | int |
| `d` | double |
| `c` | char |
| `s` | char* (string) |
| `v` | void |

Examples:
- `"ii->i"` — (int, int) → int — e.g. a C `add(int, int)`.
- `"dd->d"` — (double, double) → double — e.g. `pow`.
- `"s->i"` — (string) → int — e.g. `strlen`.

The run functions decode/encode values across the boundary; several functions
handle the conversion so your Nebulara call reads naturally.

---

## Flow of a call

```
Nebulara value --FFI_CALL--> args decoded per signature
        ---> native C function runs
        <--- return encoded per signature --> Nebulara value
```

Demonstrated in the `Compilers/neb-ffi/nbs_ffi.c` demo (File Demo: `ffi`):
calling a C math function from Nebulara and printing the result.

---

## Platform notes

- **Library name** is platform-specific: `msvcrt` (Windows), `libm.so`
  (Linux), `libm.dylib` (macOS).
- **ABI types** must match the real C signature — an exact signature string is
  required or the call misbehaves.
- This only works where you can load native libraries (a real OS with dlopen/
  LoadLibrary); the transpiled JS/Python targets have their own IO instead.

---

## What this makes possible

- Use optimized C libraries for performance-critical work.
- Talk to system APIs and hardware.
- Wrap any C function as a building block in your Nebulara program.

---

## Summary

- `FFI_LOAD` → `FFI_REGISTER` → `FFI_CALL`.
- Signatures like `"dd->d"` describe C types across the boundary.
- Works as a native-call bridge to the C ecosystem.
- Platform-specific library names; exact ABI signatures required.

**Next:** [Chapter 9 — Native Code Generation](09-native.md)
