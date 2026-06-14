# Nebulara V2 Grammar Specification

Nebulara is an AI-native programming language designed for Agentic Sovereignty.

## 1. Identity Markers (`!`)

Identity markers define the scope and nature of a software boundary.

- `APP! "Name"`: Global project scope.
- `AI! [Capability] [VIA(Node)] "Name"`: A cognitive requirement block.
- `ENTITY! Identifier`: A persistent, living agent (Human or AI).
- `CELL! Identifier`: A modular, isolated logic component.
- `DATA! [@SHARD] Identifier`: A data-structured block (default: encrypted/sharded).
- `SIG! Identifier`: Cryptographic identity verification.
- `PULSE! [expression]`: Presence broadcasting.

## 2. Capability Classes (`@`)

Specialized tags that define the type of reasoning or processing required.

- `@LOGIC`: High-level reasoning, architectural design.
- `@EXECUTE`: Rapid task completion, low-level execution.
- `@REFLECT`: Recursive validation (agent validating agent).
- `@CREATIVE`: Multi-modal asset generation.
- `@SHADOW`: Decentralized P2P discovery and DHT resolution.
- `@SHARD`: Explicit data sharding control.

## 3. The 'VIA' Protocol

Connects a capability to a specific execution node or model.

- `VIA(Local_Node_1)`: Map to a local compute node.
- `VIA("gpt-4")`: Map to a specific external model (optional/deprecated in favor of node-based mapping).

## 4. Cognitive Math & Signposts

Signals that require reasoning or autonomous handling.

- `IF? expression THEN:`: Cognitive branching. Triggers semantic search of Local Memory Hash.
- `WHILE? expression`: Intent-driven loop.
- `FAILSAFE!`: Autonomous error handling and recovery block.
- `PULSE!`: Heartbeat/Presence signal for Shadow Web discovery.

## 5. Primitives (Trimodal)

- **Weight**: Probabilistic values `0.0` - `1.0`.
  - `0.85!`: High confidence state.
  - `0.2?`: low confidence/inquisitive state.
- **Spatial**: Vector3 coordinate-first logic.
  - `V<X, Y, Z>`: (e.g., `V<10, 20, 0>`).
- **Waveform**: Frequency matching for identity.
  - `~HEX~`: (e.g., `~A4F7~`).

## 6. NVM-500 Bytecode Mapping (Selection)

| Nebulara | NVM Instruction | Note |
|----------|-----------------|------|
| `AI! @LOGIC` | `REASON <hash> Q:8` | 8-bit quantization |
| `AI! @EXECUTE` | `REASON <hash> Q:4` | 4-bit quantization |
| `IF?` | `IFP <weight>` | Probabilistic IF |
| `V<...>` | `VEC3(x, y, z)` | Spatial register |

## 7. Example: Cognitive Mesh

```nebulara
APP! "Cognitive_Core"
    ENTITY! Sovereign_Agent
        trust = 0.9!
        IF? "Node secure?" >= trust THEN:
            main_ui = V<100, 50, 0>
            PRINT "Secure. Projecting UI to: " + main_ui
        END!
    END!
END!
```
