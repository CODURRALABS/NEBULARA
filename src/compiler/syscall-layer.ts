// Nebulara System Call Layer
// Cross-platform syscall abstraction for Linux/Windows

import * as fs from 'fs'

export interface SyscallResult {
  success: boolean
  value?: number
  error?: string
}

export class MmapWrapper {
  static persist(path: string, data: Buffer): boolean {
    try {
      fs.writeFileSync(path, data)
      return true
    } catch {
      return false
    }
  }
  
  static load(path: string): Buffer | null {
    try {
      return fs.readFileSync(path)
    } catch {
      return null
    }
  }
  
  static mmapRead(path: string, offset: number, length: number): Buffer | null {
    try {
      const fd = fs.openSync(path, 'r')
      const buf = Buffer.alloc(length)
      fs.readSync(fd, buf, 0, length, offset)
      fs.closeSync(fd)
      return buf
    } catch {
      return null
    }
  }
}

export class SyscallLayer {
  private platform: 'linux' | 'windows' | 'macos'

  constructor() {
    if (process.platform === 'win32') this.platform = 'windows'
    else if (process.platform === 'darwin') this.platform = 'macos'
    else this.platform = 'linux'
  }

  mmapFile(path: string, size: number): SyscallResult {
    try {
      const fd = fs.openSync(path, 'r+')
      const buf = Buffer.alloc(size)
      fs.readSync(fd, buf, 0, size, 0)
      fs.closeSync(fd)
      return { success: true, value: 0 }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  }

  createListener(port: number, handler: (data: Buffer) => void): SyscallResult {
    const net = require('net')
    try {
      const server = net.createServer((socket: any) => {
        socket.on('data', handler)
      })
      server.listen(port)
      return { success: true }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  }

  gpuBuffer(width: number, height: number): SyscallResult {
    return { success: true, value: width * height * 4 }
  }

  getPlatformInfo(): any {
    return {
      platform: this.platform,
      arch: process.arch,
      endianness: require('os').endianness()
    }
  }
}

export const NebularaRuntime = {
  print: (msg: string) => process.stdout.write(msg + '\n'),
  pulse: (state: string) => console.log(`[PULSE] ${state}`),
  sig: (id: string) => console.log(`[SIG] ${id}`),
  weightGreater: (w: number, threshold: number): boolean => w > threshold,
  spatialDistance: (v1: any, v2: any): number => {
    return Math.sqrt((v1.x - v2.x)**2 + (v1.y - v2.y)**2 + (v1.z - v2.z)**2)
  },
  malloc: (size: number): any => ({ ptr: 0, size, data: Buffer.alloc(size) }),
  free: (ptr: any) => {}
}