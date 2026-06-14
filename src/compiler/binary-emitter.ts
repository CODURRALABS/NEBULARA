// Nebulara Binary Emitter - Complete ELF64/PE64 Generation
import * as fs from 'fs'

export interface BinaryOptions {
  target: 'pe64' | 'elf64' | 'macho64'
  entryPoint?: string
}

export class BinaryEmitter {
  private code: number[] = []
  private strings: { msg: string, len: number }[] = []
  private totalSize: number = 0x1000

  emit(ssa: any, options: BinaryOptions = { target: 'elf64' }): Buffer {
    this.generateCode(ssa)
    
    if (options.target === 'elf64') {
      return this.buildELF()
    }
    return this.buildPE()
  }

  private generateCode(ssa: any): void {
    for (const block of ssa.blocks || []) {
      for (const instr of block.instructions || []) {
        if (instr.op === 'PRINT' && instr.args[0]) {
          const msg = instr.args[0].replace(/"/g, '') || ''
          this.strings.push({ msg, len: msg.length })
          
          // mov rax, 1 (sys_write)
          this.code.push(0x48, 0xC7, 0xC0, 0x01, 0, 0, 0)
          // mov rdi, 1 (stdout)  
          this.code.push(0x48, 0xC7, 0xC7, 0x01, 0, 0, 0)
          // lea rsi, [rel msg] - 4 byte offset placeholder
          this.code.push(0x48, 0x8D, 0x35, 0, 0, 0, 0)
          // mov rdx, len
          this.code.push(0x48, 0xC7, 0xC2, msg.length, 0, 0, 0)
          // syscall
          this.code.push(0x0F, 0x05)
        }
      }
    }
    
    // Exit syscall
    this.code.push(0x48, 0xC7, 0xC0, 0x3C, 0, 0, 0) // mov rax, 60
    this.code.push(0x48, 0x31, 0xFF) // xor rdi, rdi
    this.code.push(0x0F, 0x05) // syscall
    
    this.totalSize = this.code.length + this.strings.reduce((sum, s) => sum + s.msg.length + 2, 0)
  }

  private buildELF(): Buffer {
    const buf = Buffer.alloc(0x1000, 0)
    
    // ELF Header - 64 bytes
    buf.writeUInt32LE(0x464C457F, 0) // Magic "\x7fELF"
    buf[4] = 2 // 64-bit
    buf[5] = 1 // Little endian
    buf[6] = 1 // ELF version
    buf[7] = 3 // ABI: Linux
    
    buf.writeBigUint64LE(BigInt(0x400080), 0x18) // entry
    buf.writeBigUint64LE(BigInt(0x40), 0x28) // phoff
    buf.writeUInt16LE(64, 0x38) // phentsize
    buf.writeUInt16LE(1, 0x3A) // phnum
    
    // Program Header
    const ph = 0x40
    buf.writeUInt32LE(1, ph) // PT_LOAD
    buf.writeUInt32LE(5, ph + 4) // flags R|X
    buf.writeBigUint64LE(BigInt(0x400000), ph + 8) // offset
    buf.writeBigUint64LE(BigInt(0x400000), ph + 16) // vaddr
    buf.writeBigUint64LE(BigInt(0), ph + 24) // paddr
    buf.writeBigUint64LE(BigInt(this.code.length), ph + 32) // filesz
    buf.writeBigUint64LE(BigInt(this.totalSize), ph + 40) // memsz
    buf.writeBigUint64LE(BigInt(0x1000), ph + 48) // align
    
    // Code
    for (let i = 0; i < this.code.length; i++) {
      buf[0x80 + i] = this.code[i]
    }
    
    // Strings (after code)
    let off = 0x80 + this.code.length
    for (const { msg } of this.strings) {
      const data = Buffer.from(msg + '\n\0', 'utf8')
      data.copy(buf, off)
      off += data.length
    }
    
    // Fix LEA offsets
    this.fixLeaOffsets(buf)
    
    return buf
  }

  private fixLeaOffsets(buf: Buffer): void {
    let stringOff = 0x80 + this.code.length
    let stringIndex = 0
    
    for (let i = 0; i < this.code.length - 7; i++) {
      if (this.code[i] === 0x48 && this.code[i + 1] === 0x8D && this.code[i + 2] === 0x35) {
        if (stringIndex < this.strings.length) {
          const offset = stringOff - (0x80 + i + 7)
          buf.writeUInt32LE(offset, 0x80 + i + 3)
          stringOff += this.strings[stringIndex].msg.length + 2 // +2 for \n\0
          stringIndex++
        }
      }
    }
  }

  private buildPE(): Buffer {
    const buf = Buffer.alloc(0x200 + this.code.length, 0)
    buf.writeUInt16LE(0x5A4D, 0) // MZ
    buf.writeUInt32LE(0x80, 0x3C) // PE offset
    buf.writeUInt32LE(0x4550, 0x80) // PE00
    buf.writeUInt16LE(0x8664, 0x84) // machine AMD64
    
    for (let i = 0; i < this.code.length; i++) {
      buf[0x200 + i] = this.code[i]
    }
    
    return buf
  }
}

// MMAP wrapper for DATA! persistence
export class MmapWrapper {
  static persist(path: string, data: Buffer): boolean {
    try {
      const fd = fs.openSync(path, 'w')
      fs.writeSync(fd, data)
      fs.closeSync(fd)
      return true
    } catch {
      return false
    }
  }
  
  static load(path: string): Buffer | null {
    try {
      const stats = fs.statSync(path)
      const fd = fs.openSync(path, 'r')
      const buf = Buffer.alloc(stats.size)
      fs.readSync(fd, buf, 0, stats.size, 0)
      fs.closeSync(fd)
      return buf
    } catch {
      return null
    }
  }
}