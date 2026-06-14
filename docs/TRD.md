# Technical Requirements Document (TRD): Aether Core & NVM-500

## 1. System Architecture
The Nebulara system consists of three distinct layers:
- **Compiler Layer**: AST generation, Trimodal Lexing, and Quantization-Aware Transpilation.
- **Runtime Layer (NVM-500)**: Bytecode interpreter optimized for weight-based logic and tensor operations.
- **Infrastructure Layer (Aether Core)**: Sovereign IaaS managing local hardware resources, identity (SIG!), and P2P mesh connectivity.

## 2. Theoretical Foundation: Cognitive Math
- **Confidence Weights (W)**: All variables exist in a state of probability until invoked.
- **Operator Overloading**: `+`, `-`, `*`, `/` map to quantized tensor arithmetic (INT4/INT8).
- **Semantics**: `IF?` triggers a Local Memory Hash lookup via a RAG-enhanced semantic search.

## 3. Communication: The Shadow Web
- **Networking**: Bypasses TCP/IP. Uses DHT-based mesh networking for peer discovery.
- **Sharding**: Data marked with `DATA!` or `@SHARD` is automatically encrypted and distributed across the mesh.
- **Heartbeat**: `PULSE!` markers broadcast node health and presence using hardware entropy.

## 4. Virtual Machine Specs (NVM-500)
- **Word Size**: 16-bit cognitive weights.
- **Quantization**: 
    - **INT4**: Dynamic scaling for rapid `@EXECUTE`.
    - **INT8**: Precision-preserving scale for `@LOGIC`.
- **Instructions**:
    - `MATCH <pattern> <sensitivity>`: Fingerprint matching.
    - `MESH <mode> <block>`: Swarm consensus (0: Majority, 1: Confidence).

## 5. Security & Sovereignty
- **Identity**: Hardware-bound `SIG!` signatures.
- **Privilege**: NIA operates with System-Level (Admin) sovereignty by default.
- **Isolation**: Memory silos for highly sensitive `@SHARD` data.
