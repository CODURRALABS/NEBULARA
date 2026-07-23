# Nebulara API Reference

## Classes

### Nebulara (Main Class)

```typescript
const neb = new Nebulara()

// Interpretation
neb.interpret('PRINT "hello"')

// Transpilation
neb.toJavaScript('PRINT "hello"')
neb.toPython('PRINT "hello"')
neb.toCPP('PRINT "hello"')
neb.toRust('PRINT "hello"')

// Compilation
const binary: Buffer = neb.compile('PRINT "hello"')
```

### NVM500

```typescript
const vm = new NVM500()

// Execute SSA program
vm.execute({ blocks: [...], entry: 'entry' })

// Trimodal weight evaluation
vm.evaluateWeight(0.8, 'MID')  // true
vm.evaluateWeight(0.8, 'HIGH') // false
```

### CognitiveLogicEngine

```typescript
const engine = new CognitiveLogicEngine()

// Weight
engine.evaluateWeight(0.8, 'MID')

// Spatial
engine.spatialVector.distance({ x:0,y:0,z:0 }, { x:3,y:4,z:0 })
engine.spatialVector.normalize({ x:3,y:4,z:0 })
engine.spatialVector.dot(v1, v2)

// Waveform
engine.waveform.parse('~A4F7~')
engine.waveform.amplitude(bytes)
engine.waveform.frequency(bytes)
```

### SpatialRenderer

```typescript
const renderer = new SpatialRenderer()

// Parse
renderer.parseVector('V<1,2,3>')

// Render
renderer.renderASCII([{ x:0,y:0,z:0 }])
renderer.createField(10, 10)
```

### AuroraOrchestrator

```typescript
const aurora = new AuroraOrchestrator()

// Execute agent
aurora.execute('CODESMITH', { intent: 'print hello' })

// List agents
aurora.list() // ['CODESMITH', 'VISUALIA', ...]
```

### ShadowWeb

```typescript
const node = await neb.createP2PNode(8080)
node.on('data', handler)
```

### WaveformDSP

```typescript
const dsp = new WaveformDSP()

// Parse
dsp.parse('~A4F7B2C1~')

// Generate
dsp.generate(0.5, 0.8, 0, 32)

// Match
dsp.match(pattern, target, 0.8)
```

### JITCompiler

```typescript
const jit = new JITCompiler()
jit.recordExecution('hot_block')
const code = jit.getCompiledCode('hot_block')
```

---

## Types

### TargetLanguage
```typescript
type TargetLanguage = 'javascript' | 'python' | 'css' | 'html' | 'cpp' | 'csharp' | 'rust' | 'wasm' | 'json' | 'asm'
```

### CognitiveMode
```typescript
type CognitiveMode = 'LOW' | 'MID' | 'HIGH'
```

### SpatialVector3D
```typescript
interface { x: number, y: number, z: number }
```

### Waveform
```typescript
interface {
  bytes: number[]
  frequency: number
  amplitude: number
  phase: number
}
```

---

## Functions

### mmap (MmapWrapper)
```typescript
MmapWrapper.persist(path, buffer)
MmapWrapper.load(path)
MmapWrapper.mmapRead(path, offset, length)
```