// Nebulara Type Definitions
// Generated from TypeScript source

export interface NebularaValue {
  type: 'number' | 'string' | 'weight' | 'spatial' | 'waveform' | 'null'
  value: any
}

export interface ASTNode {
  type: string
  [key: string]: any
}

export interface SSAInstruction {
  op: string
  dst?: string
  args: string[]
}

export interface SpatialVector3D {
  x: number
  y: number
  z: number
}

export interface Camera {
  position: SpatialVector3D
  target: SpatialVector3D
  fov: number
}