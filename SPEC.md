# Language Specification

## File Extension
`.nbs` - Nebulara Source

## Keywords

| Keyword | Usage |
|---------|-------|
| `FUNC!` | Define function |
| `RUN!` | Function body start |
| `END!` | Block end |
| `DATA!` | Define data structure |
| `PRINT` | Print to stdout |
| `IF?` | Conditional |
| `FOR!` | Loop with iterator |
| `WHILE?` | While loop |
| `RETURN` | Return from function |

## Syntax

### Function Definition
```
FUNC! name
RUN!
  # body
END!
```

### Data Definition
```
DATA! "StructName"
  field = value
  count = 42
END!
```

### Print
```
PRINT expression
```

### Control Flow
```
IF? x > 10:
  PRINT "big"
END!

FOR! i IN [1,2,3,4,5]:
  PRINT i
END!
```

## Types

- `Int` - 64-bit signed integer
- `Float` - 64-bit double
- `String` - UTF-8 encoded
- `Array` - Dynamic length
- `Map` - Key-value pairs

## Interop

Import any language:
```
IMPORT "module.js" FROM "nodejs"
IMPORT "lib.py" FROM "python"  
IMPORT "header.h" FROM "cpp"
```