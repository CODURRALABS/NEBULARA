# API Reference
# Void Consciousness Architecture

## Core Module (`void/core.nbs`)

### Functions

#### `validate_logic(values: Array) -> Boolean`
Tests for logical consistency in values.
- Returns `false` if any value is NaN or Infinity

#### `validate_conservation(values: Array) -> Boolean`
Tests for information conservation.
- All values must remain finite

#### `validate_causality(values: Array) -> Boolean`
Tests temporal ordering.
- Returns `false` if prev > next in sequence

#### `validate_against_dharma(values: Array) -> Boolean`
Tests all cosmic laws.
- Returns `true` if all validations pass

## Intent Module (`void/intent.nbs`)

### Types

```
IntentState = {
  resting: 0,
  seeking: 1,
  resolving: 2,
  crystallizing: 3
}
```

### Functions

#### `activate(target: String, intensity: Float) -> Intent`
Activates curiosity frequency.
- Sets intent phase to seeking
- Intensity clamped to 0.0-1.0

#### `resonance_vector() -> SpatialVector`
Returns the geometric intent vector.
- Uses format: `V<frequency, intensity, frequency*intensity>`
- Returns null if resting

#### `entropy_reduction_potential(complexity: Float) -> Float`
Calculates resolution potential.
- Formula: `intensity * frequency / (1 + complexity)`

#### `is_active() -> Boolean`
Checks if intent is engaged.
- Returns true if phase != resting

## Context Module (`void/context.nbs`)

### Types

```
Manifold = {
  flat: { type: "flat" },
  curved: { type: "curved", curvature: Float },
  discrete: { type: "discrete", cardinality: Int }
}
```

### Functions

#### `map_problem(input: String) -> Context`
Maps input to structural context.
- Creates SHA-256 signature
- Builds logical nodes per line
- Generates geometric vertices

#### `isolate_contradictions() -> Array<usize>`
Finds contradiction/paradox points.
- Searches logical_map for keywords

#### `structural_signature() -> String`
Returns context summary.
- Format: `sig:XX nodes:N contradictions:N shape:TYPE`

#### `spatial_hash(text: String) -> SpatialVector`
Converts text to V<x,y,z> representation.

## Wisdom Module (`void/wisdom.nbs`)

### Functions

#### `crystallize(resolution: String, context_sig: String) -> String`
Creates earned insight.
- Returns SHA-256 insight ID

#### `recognize(context_shape: String) -> Insight?`
Finds applicable wisdom.
- Matches by applicability signature

#### `apply_pathway(context_shape: String) -> Pathway?`
Finds resolution pathway.
- Matches by trigger shape

## Library Module (`void/library.nbs`)

### Functions

#### `fetch_fragment(query: String, context_shape: String) -> Fragment?`
Fetches from internet.
- Uses geometric relevance scoring

#### `text_to_spatial(text: String) -> SpatialVector`
Converts text to geometry.
- Enables distance-based search

#### `selective_import(fragments: Array) -> Array`
Filters valid fragments.
- Only structurally valid + relevance > 0.5

## Engine Module (`void/engine.nbs`)

### Functions

#### `process(input: String) -> Result<String, Error>`
Full processing pipeline.
- Context mapping
- Intent activation
- Wisdom lookup or crystallization

#### `new_engine() -> VoidEngine`
Creates engine instance.
- Initializes all four layers

## IPC Module (`void/ipc.nbs`)

### Functions

#### `void_process_request(data: String) -> Response`
IPC endpoint.
- Processes via geometric signature

#### `register_void_ipc() -> Boolean`
Registers on IPC bus.
- Required for Tauri integration