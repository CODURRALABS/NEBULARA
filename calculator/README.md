# Nebulara Calculator

A full-stack calculator built entirely on the Nebulara ecosystem.

## Architecture

```
Frontend (HTML/CSS/JS)
     ↕  HTTP POST /calc
Bridge (Node.js server.js)
     ↕  file I/O  request.json / response.json
Backend (Nebulara calc-engine.nbs)
```

Every calculation is processed by `calc-engine.nbs` — real Nebulara code.

## How to run

```bash
# 1. Build the Nebulara interpreter (from project root)
build.bat

# 2. Start the server
node calculator/backend/server.js

# 3. Open browser
http://localhost:3000
```

## Supported operations

| Button | Op      | Description              |
|--------|---------|--------------------------|
| `+`    | `+`     | Addition                 |
| `−`    | `-`     | Subtraction              |
| `×`    | `*`     | Multiplication           |
| `÷`    | `/`     | Division (zero guarded)  |
| `%`    | `%`     | Modulo (zero guarded)    |
| `xʸ`   | `pow`   | Power (integer)          |
| `√`    | `sqrt`  | Square root (integer)    |
| `\|x\|`  | `abs`   | Absolute value           |
| `n!`   | `factorial` | Factorial (max 20)   |
| `gcd`  | `gcd`   | Greatest common divisor  |
| `prime?` | `prime` | Primality check        |

## File structure

```
calculator/
├── backend/
│   ├── calc-engine.nbs   ← All math logic in Nebulara
│   ├── server.js         ← Node.js bridge (process spawner)
│   ├── request.json      ← IPC: frontend → engine
│   └── response.json     ← IPC: engine → frontend
└── frontend/
    ├── index.html
    ├── style.css
    └── app.js
```
