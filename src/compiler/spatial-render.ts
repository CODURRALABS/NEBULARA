// Spatial Renderer - V<x,y,z> vector visualization
// ASCII/Canvas/Vulkan output for spatial vectors

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

export class SpatialRenderer {
  private canvas: any = null
  private width: number = 800
  private height: number = 600

  constructor(width?: number, height?: number) {
    if (width) this.width = width
    if (height) this.height = height
  }

  // Create canvas if in browser
  initCanvas(canvasId?: string): boolean {
    try {
      if (typeof document !== 'undefined') {
        this.canvas = canvasId ? document.getElementById(canvasId) : document.createElement('canvas')
        return true
      }
    } catch {
      // Node.js fallback
      return false
    }
    return false
  }

  // Project 3D to 2D
  project(v: SpatialVector3D, camera: Camera): { x: number, y: number } {
    // Simple perspective projection
    const dx = v.x - camera.position.x
    const dy = v.y - camera.position.y
    const dz = v.z - camera.position.z

    const scale = camera.fov / (camera.fov + dz)
    return {
      x: Math.round(this.width / 2 + dx * scale),
      y: Math.round(this.height / 2 + dy * scale)
    }
  }

  // Render vectors as ASCII art
  renderASCII(vectors: SpatialVector3D[], gridWidth = 40, gridHeight = 20): string {
    const grid: string[][] = []
    for (let i = 0; i < gridHeight; i++) {
      grid[i] = []
      for (let j = 0; j < gridWidth; j++) {
        grid[i][j] = ' '
      }
    }
    
    for (const v of vectors) {
      const px = Math.max(0, Math.min(gridWidth - 1, Math.floor((v.x + 1) / 2 * (gridWidth - 1))))
      const py = Math.max(0, Math.min(gridHeight - 1, Math.floor((v.y + 1) / 2 * (gridHeight - 1))))
      const row = Math.max(0, Math.min(gridHeight - 1, Math.floor(gridHeight / 2 - py)))
      grid[row][px] = '*'
    }

    return grid.map(row => row.join('')).join('\n')
  }

  // Render to console with depth shading
  renderConsole(vectors: SpatialVector3D[], camera: Camera): void {
    const projected = vectors.map(v => this.project(v, camera))
    const sorted = [...projected].sort((a, b) => a.y - b.y)
    
    for (const p of sorted) {
      const depth = p.y / this.height
      const char = depth > 0.7 ? '●' : depth > 0.3 ? '◐' : '○'
      console.log(`  ${' '.repeat(Math.floor(p.x / 10))}${char}`)
    }
  }

  // Create spatial field from expression
  createField(density = 10, range = 10): SpatialVector3D[] {
    const field: SpatialVector3D[] = []
    for (let i = 0; i < density; i++) {
      for (let j = 0; j < density; j++) {
        field.push({
          x: (i / density - 0.5) * range,
          y: (j / density - 0.5) * range,
          z: Math.sin(i * 0.5) * Math.cos(j * 0.5) * range * 0.5
        })
      }
    }
    return field
  }

  // Parse V<x,y,z> syntax
  parseVector(str: string): SpatialVector3D | null {
    const match = str.match(/V<([^,>]+),([^,>]+),([^>]+)>/)
    if (!match) return null
    return {
      x: parseFloat(match[1]),
      y: parseFloat(match[2]),
      z: parseFloat(match[3])
    }
  }

  // Vector field operations
  fieldOperations = {
    add: (v1: SpatialVector3D, v2: SpatialVector3D): SpatialVector3D => ({
      x: v1.x + v2.x,
      y: v1.y + v2.y,
      z: v1.z + v2.z
    }),

    scale: (v: SpatialVector3D, s: number): SpatialVector3D => ({
      x: v.x * s,
      y: v.y * s,
      z: v.z * s
    }),

    length: (v: SpatialVector3D): number => Math.sqrt(v.x**2 + v.y**2 + v.z**2)
  }
}