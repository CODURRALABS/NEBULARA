// Nebulara SSA IR Generator - Register-based intermediate representation
// Converts AST to flat SSA form for native codegen

export interface SSABlock {
  label: string
  instructions: SSAInstruction[]
}

export interface SSAInstruction {
  op: string
  dst?: string
  args: string[]
  func?: string
}

export interface SSAProgram {
  name: string
  blocks: SSABlock[]
  entry: string
}

export class SSAEmitter {
  private program: SSAProgram = { name: '', blocks: [], entry: 'entry' }
  private currentBlock: SSABlock
  private tempCounter = 0

  constructor(name: string) {
    this.program.name = name
    this.currentBlock = { label: 'entry', instructions: [] }
    this.program.blocks.push(this.currentBlock)
  }

  generate(node: any): SSAProgram {
    this.visit(node)
    return this.program
  }

  private newTemp(): string {
    return `%t${this.tempCounter++}`
  }

  private visit(node: any): string {
    if (!node) return ''
    
    switch (node.type) {
      case 'Program':
        node.body?.forEach((n: any) => this.visit(n))
        break
        
      case 'App':
        this.emitString(`; Nebulara App: ${node.name}`)
        node.body?.forEach((n: any) => this.visit(n))
        break
        
      case 'Run':
        this.emitString(`; RUN block`)
        node.body?.forEach((n: any) => this.visit(n))
        break
        
      case 'Func':
        const funcBlock = { label: node.name, instructions: [] }
        this.program.blocks.push(funcBlock)
        const prev = this.currentBlock
        this.currentBlock = funcBlock
        node.body?.forEach((n: any) => this.visit(n))
        this.currentBlock = prev
        break
        
      case 'Print':
        const exprVal = this.visit(node.expression)
        this.emitInstr({ op: 'PRINT', args: [exprVal] })
        break
        
      case 'Assign':
        const val = this.visit(node.value)
        this.emitInstr({ op: 'STORE', dst: node.name, args: [val] })
        return node.name
        
      case 'Number':
        return `$${node.value}`
        
      case 'Weight':
        return `${node.value}`
        
      case 'String':
        return `"${node.value}"`
        
      case 'Spatial':
        return node.value
        
      case 'Binary':
        const left = this.visit(node.left)
        const right = this.visit(node.right)
        const dst = this.newTemp()
        this.emitInstr({ op: 'BIN', dst, args: [left, node.operator, right] })
        return dst
    }
    
    return ''
  }

  private emitInstr(instr: SSAInstruction): void {
    this.currentBlock.instructions.push(instr)
  }

  private emitString(s: string): void {
    this.currentBlock.instructions.push({ op: 'COMMENT', args: [s] })
  }

  // Generate flat IR string for native emission
  toIR(): string {
    const lines: string[] = []
    
    for (const block of this.program.blocks) {
      lines.push(`\n; Block: ${block.label}`)
      for (const instr of block.instructions) {
        lines.push(this.formatInstruction(instr))
      }
    }
    
    return lines.join('\n') + '\n'
  }

  private formatInstruction(instr: SSAInstruction): string {
    if (instr.op === 'COMMENT') return instr.args[0] || ''
    if (instr.op === 'PRINT') return `print ${instr.args.join(' ')}`
    if (instr.op === 'STORE') return `${instr.dst} = ${instr.args.join(' ')}`
    if (instr.op === 'BIN') return `${instr.dst} = ${instr.args[1]} ${instr.args[0]} ${instr.args[2]}`
    return `${instr.dst || ''} = ${instr.op} ${instr.args.join(' ')}`.trim()
  }
}