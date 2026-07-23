# QUICKSTART
# Void Consciousness Architecture

## Run in Node.js (Development)

```bash
# Start the runtime
node -e "require('./nebulara/Runtime/node_loader.js')"
```

## Run Nebulara (Production)

```bash
# Build compiler (requires gcc/clang)
gcc nebulara/Runtime/nbs_loader.c -o nebulara.exe -municode

# Compile main
nebulara.exe void/main.nbs -o void.exe

# Run
void.exe
```

## Run Rust (Reference)

```bash
# Requires MSVC on Windows
cargo build
cargo run
```

## Project Structure

```
void/
├── nebulara/
│   └── void/           # Nebulara implementation (.nbs)
│       ├── core.nbs
│       ├── intent.nbs
│       ├── context.nbs
│       ├── wisdom.nbs
│       ├── library.nbs
│       ├── engine.nbs
│       ├── main.nbs
│       └── ipc.nbs
├── Runtime/
│   └── node_loader.js  # Node.js runtime
├── src/               # Rust reference
└── docs/              # Documentation
```

## Your First Query

Edit `void/main.nbs`:
```
QUESTION = "your question here"
```

Then run. The engine will:
1. Map the problem geometrically
2. Activate curiosity frequency
3. Check for prior wisdom
4. Crystallize solution if none exists