# Chapter 8 — Calling C with FFI

> Book: *Beyond the Bases* · Part III — Going Universal

The **Foreign Function Interface (FFI)** lets Nebulara call native C functions
directly. This unlocks the entire C ecosystem — and is the mechanism that makes
the "universal" claim concrete at the ABI level.

---

## The three builtins

Nebulara exposes FFI through three builtins:

| Builtin | Signature | Purpose |
|---------|-----------|---------|
| `FFI_LOAD` | `FFI_LOAD(name, path)` | Load a shared library / DLL |
| `FFI_REGISTER` | `FFI_REGISTER(lib, sym, retType, nArgs)` | Declare a function |
| `FFI_CALL` | `FFI_CALL(lib, sym, args...)` | Call it |

- `FFI_LOAD` takes a **lookup name** (first arg) and the **file path** to the
  DLL/so (second arg). On Windows, `path` is fed to `LoadLibraryA`.
- `FFI_REGISTER` binds a symbol from a loaded library. `retType` is an integer
  return-type code, `nArgs` the fixed argument count:
  | Code | Type |
  |------|------|
  | `0` | void |
  | `1` | int |
  | `2` | float |
  | `3` | double |
  | `4` | string |
  | `5` | pointer |
- `FFI_CALL` looks up the registered function by lib name + symbol (not a
  handle) and invokes it. Arguments are passed as machine ints/pointers; the
  return value is decoded per the registered `retType`.

---

## A working example (Windows / msvcrt)

Load the C runtime, register `abs`, and call it:

```nbs
FFI_LOAD("msvcrt", "msvcrt.dll")
FFI_REGISTER("msvcrt", "abs", 1, 1)     # ret=int(1), 1 argument
LET result = FFI_CALL("msvcrt", "abs", -42)
PRINT result                              # 42
```

Interpretation:
- `FFI_LOAD("msvcrt", "msvcrt.dll")` registers a lib named `msvcrt` with the
  path `msvcrt.dll`.
- `FFI_REGISTER("msvcrt", "abs", 1, 1)` finds `abs`, return type `int`,
  one argument.
- `FFI_CALL("msvcrt", "abs", -42)` invokes it → `42`.

Nothing returns a handle; you always refer to functions by `(lib, symbol)`.

---

## The return-type codes

`FFI_REGISTER` selects the return type with an integer code:

| Code | Meaning |
|------|---------|
| `0` | void (returns 0) |
| `1` | int |
| `2` | float (32-bit) |
| `3` | double (64-bit) |
| `4` | string (`const char*`, imported as a Nebulara string) |
| `5` | pointer (imported as a string if non-null) |

There is **no signature string** — the ABI is fixed-width int/pointer
arguments plus a single chosen return type. The run functions decode/encode
values across the boundary.

---

## Flow of a call

```
Nebulara value --FFI_CALL--> args pushed as intptr_t
        ---> native C function runs
        <--- return encoded per retType --> Nebulara value
```

Demonstrated in the `Compilers/neb-ffi.c` demo (`ffi_register_func` +
`FFI_TYPE_INT`): calling a C math function from Nebulara and printing the
result.

---

## Platform notes

- **Library path** is platform-specific: `msvcrt.dll` / `user32.dll`
  (Windows), `libm.so.6` (Linux), `libm.dylib` (macOS).
- **Types are best-effort**: args are ints or `const char*` pointers; floats/
  doubles are not marshalled precisely in every build — prefer int/string
  functions for reliable calls.
- Only works where you can load native libraries (a real OS with dlopen/
  LoadLibrary); the transpiled JS/Python targets have their own IO instead.

---

## What this makes possible

- Use optimized C libraries for performance-critical work.
- Talk to system APIs and hardware.
- Wrap any C function as a building block in your Nebulara program.

---

## Summary

- `FFI_LOAD(name, path)` → `FFI_REGISTER(lib, sym, retType, nArgs)` →
  `FFI_CALL(lib, sym, args...)`.
- Refer to functions by **lib name + symbol**, not by handles.
- Return type is an integer code (`0`..`5`), not a signature string.
- Platform-specific library paths; int/string-returning functions are the
  reliable ones.

**Next:** [Chapter 9 — Native Code Generation](09-native.md)