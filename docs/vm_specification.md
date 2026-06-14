# Nebulara Virtual Machine (NVM-500) Specification

The **NVM-500** is a custom, weight-native execution environment designed for the **Omni 500** model. It replaces deterministic Boolean evaluation with a probabilistic, tensor-aware instruction set.

## 1. Core Architecture

- **Primary Unit**: Cognitive Weight (W) - A 16-bit float representing confidence (0.0 - 1.0).
- **Quantum Registers**: 64 semantic registers that can hold "Superposition" states until an `OBSERVE` instruction (triggered by `@EXECUTE`).
- **Quantization**: Native support for **INT4** and **INT8** operations to ensure 150+ TPS on local hardware.

## 2. Instruction Set (NVM-Bytecode)

### Logic & Reasoning
- `REASON <hash>`: Triggers a semantic search against the local memory hash.
- `BPROB <reg> <weight>`: Branch if the weight in `<reg>` exceeds the threshold.
- `SENSE <vector>`: Resolves spatial proximity between the current context and a coordinate vector.

### Spatial Math
- `VMOVE <v1> <v2>`: Translation between two Vector3 coordinates.
- `VPROJ <v1> <canvas>`: Project spatial coordinate to the NIA vision head.

### IO & Shell
- `SYSCALL <string>`: Directly invokes a localized shell command (Admin Sovereignty).
- `PULSE <conf>`: Broadcast presence with a specific confidence weight to the Shadow Web.

## 3. Quantization Strategy

- **INT4 Precision**: Used for rapid `@EXECUTE` tasks where high precision is not required.
- **INT8 Precision**: Used for `@LOGIC` and architectural reasoning.
- **Calibration**: The compiler automatically selects bits based on the capability tag (`@LOGIC` vs `@EXECUTE`).

## 4. Shadow Network Integration

- **SIG_GEN**: Uses hardware entropy for cryptographic signatures.
- **DHT_LINK**: Graph-based non-linear addressing for peer discovery.

## 5. Metadata

- **Density**: Each instruction is optimized to be <2 tokens in the Omni context.
- **Throughput**: Optimized for local ProBook hardware (Target: 150+ TPS).
