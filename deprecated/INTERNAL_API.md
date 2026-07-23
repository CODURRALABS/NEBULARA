# Internal API
# Void - Node.js Runtime

## NbsRuntime Class

```javascript
const { NbsRuntime } = require('./Runtime/node_loader.js');

// Create runtime
const rt = new NbsRuntime();

// Load module
rt.loadModule('./void/core.nbs');

// Call function
rt.call('validate_logic', [1, 2, 3]); // Returns parsed function body
```

## Methods

### loadModule(filePath: string): NbsRuntime
- Loads .nbs file
- Parses DATA! and FUNC! blocks
- Registers functions for calling

### call(name: string, args: any[]): any
- Executes named function
- Passes arguments
- Returns parsed result

## Data Structures

### SpatialVector
```
V<x, y, z> - Object with 3 float components
Operations: DISTANCE, TRANSFORM, MANIFOLD_CHECK
```

### Context
```
{
  problem_signature: string (SHA-256),
  logical_map: Array<{id, content, vertex}>,
  contradiction_points: Array<number>,
  geometric_shape: { manifold, vertices }
}
```

### Wisdom
```
{
  insights: Map<string, Insight>,
  pathways: Map<string, Pathway>
}
```

## Built-in Functions (Planned)

- SHA256(text) → string
- DISTANCE(v1, v2) → float
- ENCODE_URL(text) → string
- HTTP_GET(url) → {text, error}
- CONSOLE_LOG(msg) → void