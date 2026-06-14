// Nebulara Core Parser - Handwritten, recursive descent
// 400 lines of pure AST generation

import { Token, TokenType, NebularaLexer } from '../lexer/lexer-core.js'

export interface ASTNode {
  type: string
  [key: string]: any
}

export class Parser {
  private tokens: Token[] = []
  private pos: number = 0

  parse(input: string): ASTNode {
    const lexer = new NebularaLexer(input)
    this.tokens = lexer.tokenize()
    return this.parseProgram()
  }

  private parseProgram(): ASTNode {
    const body: ASTNode[] = []
    while (this.peek()?.type !== TokenType.EOF) {
      const stmt = this.parseStatement()
      if (stmt) body.push(stmt)
    }
    return { type: 'Program', body }
  }

  private parseStatement(): ASTNode | null {
    const tok = this.peek()
    if (!tok) return null

    switch (tok.type) {
      case TokenType.APP: return this.parseApp()
      case TokenType.AI: return this.parseAI()
      case TokenType.ENTITY: return this.parseEntity()
      case TokenType.CELL: return this.parseCell()
      case TokenType.DATA: return this.parseData()
      case TokenType.RUN: return this.parseRun()
      case TokenType.PACKAGE: return this.parsePackage()
      case TokenType.LINK: return this.parseLink()
      case TokenType.PRINT: return this.parsePrint()
      case TokenType.IF: return this.parseIf()
      case TokenType.WHILE: return this.parseWhile()
      case TokenType.LOOP: return this.parseLoop()
      case TokenType.FUNC: return this.parseFunc()
      case TokenType.RETURN: return this.parseReturn()
      case TokenType.SIG: return this.parseSig()
      case TokenType.PULSE: return this.parsePulse()
      case TokenType.MATCH: return this.parseMatch()
      case TokenType.MESH: return this.parseMesh()
      case TokenType.FAILSAFE: return this.parseFailsafe()
      case TokenType.IDENTIFIER: return this.parseAssignment()
      default:
        this.consume() // skip unknown
        return null
    }
  }

  private parseApp(): ASTNode {
    this.consume() // APP
    const name = this.expect(TokenType.STRING)?.value || ''
    const body = this.parseBlockBody()
    return { type: 'App', name, body }
  }

  private parseAI(): ASTNode {
    this.consume() // AI
    let capability: string | null = null
    let via: string | null = null

    if (this.peek()?.type === TokenType.LOGIC ||
        this.peek()?.type === TokenType.EXECUTE ||
        this.peek()?.type === TokenType.REFLECT ||
        this.peek()?.type === TokenType.SHADOW) {
      capability = this.consume().value
    }

    if (this.peek()?.value === 'VIA') {
      this.consume() // VIA
      this.consume() // (
      via = this.expect(TokenType.IDENTIFIER)?.value || ''
      this.consume() // )
    }

    const name = this.expect(TokenType.STRING | TokenType.IDENTIFIER)?.value || ''
    const body = this.parseBlockBody()
    return { type: 'AI', capability, via, name, body }
  }

  private parseEntity(): ASTNode {
    this.consume() // ENTITY
    const name = this.expect(TokenType.IDENTIFIER | TokenType.STRING)?.value || ''
    const body = this.parseBlockBody()
    return { type: 'Entity', name, body }
  }

  private parseCell(): ASTNode {
    this.consume() // CELL
    const name = this.expect(TokenType.IDENTIFIER | TokenType.STRING)?.value || ''
    const body = this.parseBlockBody()
    return { type: 'Cell', name, body }
  }

  private parseData(): ASTNode {
    this.consume() // DATA
    const sharded = this.peek()?.type === TokenType.SHARD
    if (sharded) this.consume()
    const name = this.expect(TokenType.IDENTIFIER)?.value || ''
    const body = this.parseBlockBody()
    return { type: 'Data', name, sharded, body }
  }

  private parseRun(): ASTNode {
    this.consume() // RUN
    const body = this.parseBlockBody()
    return { type: 'Run', body }
  }

  private parsePackage(): ASTNode {
    this.consume() // PACKAGE
    const name = this.expect(TokenType.STRING)?.value || ''
    let sig: string | null = null
    if (this.peek()?.type === TokenType.SIG) {
      this.consume() // SIG
      sig = this.expect(TokenType.IDENTIFIER)?.value || null
    }
    const body = this.parseBlockBody()
    return { type: 'Package', name, sig, body }
  }

  private parseLink(): ASTNode {
    this.consume() // LINK
    const module = this.expect(TokenType.STRING)?.value || ''
    return { type: 'Link', module }
  }

  private parsePrint(): ASTNode {
    this.consume() // PRINT
    const expr = this.parseExpression()
    return { type: 'Print', expression: expr }
  }

  private parseIf(): ASTNode {
    this.consume() // IF
    const condition = this.parseExpression()
    this.expect(TokenType.THEN) // THEN:
    const consequent = this.parseBlockBody()
    let alternate: ASTNode[] | null = null
    
    if (this.peek()?.type === TokenType.ELSE) {
      this.consume() // ELSE:
      alternate = this.parseBlockBody()
    }
    
    this.expectEnd()
    return { type: 'If', condition, consequent, alternate }
  }

  private parseWhile(): ASTNode {
    this.consume() // WHILE
    const condition = this.parseExpression()
    this.expect(TokenType.THEN) // THEN:
    const body = this.parseBlockBody()
    this.expectEnd()
    return { type: 'While', condition, body }
  }

  private parseLoop(): ASTNode {
    this.consume() // LOOP
    const body = this.parseBlockBody()
    this.expectEnd()
    return { type: 'Loop', body }
  }

  private parseFunc(): ASTNode {
    this.consume() // FUNC
    const name = this.expect(TokenType.STRING)?.value || ''
    const params: string[] = []
    
    if (this.peek()?.value === '(') {
      this.consume() // (
      while (this.peek()?.type !== TokenType.RPAREN) {
        const param = this.expect(TokenType.IDENTIFIER)
        if (param) params.push(param.value)
        if (this.peek()?.type === TokenType.COMMA) this.consume()
      }
      this.consume() // )
    }
    
    const body = this.parseBlockBody()
    this.expectEnd()
    return { type: 'Func', name, params, body }
  }

  private parseReturn(): ASTNode {
    this.consume() // RETURN
    const expr = this.parseExpression()
    this.expectEnd()
    return { type: 'Return', expression: expr }
  }

  private parseSig(): ASTNode {
    this.consume() // SIG
    const identity = this.expect(TokenType.IDENTIFIER)?.value || ''
    this.expectEnd()
    return { type: 'Sig', identity }
  }

  private parsePulse(): ASTNode {
    this.consume() // PULSE
    const expr = this.peek()?.type !== TokenType.NEWLINE && 
                 this.peek()?.type !== TokenType.SEMI &&
                 this.peek()?.type !== TokenType.END ? 
                 this.parseExpression() : null
    this.expectEnd()
    return { type: 'Pulse', expression: expr }
  }

  private parseMatch(): ASTNode {
    this.consume() // MATCH
    const expr = this.parseExpression()
    let sensitivity = '0.8!'
    if (this.peek()?.value === 'WITH') {
      this.consume() // WITH
      const tok = this.expect(TokenType.WEIGHT)
      if (tok) sensitivity = tok.value
    }
    this.expectEnd()
    return { type: 'Match', expression: expr, sensitivity }
  }

  private parseMesh(): ASTNode {
    this.consume() // MESH
    let mode = 'MAJORITY'
    if (this.peek()?.value === 'WITH') {
      this.consume() // WITH
      const tok = this.consume()
      mode = tok.value
    }
    const body = this.parseBlockBody()
    this.expectEnd()
    return { type: 'Mesh', mode, body }
  }

  private parseFailsafe(): ASTNode {
    this.consume() // FAILSAFE
    const body = this.parseBlockBody()
    this.expectEnd()
    return { type: 'Failsafe', body }
  }

  private parseAssignment(): ASTNode | null {
    const name = this.consume().value
    if (this.peek()?.type !== TokenType.ASSIGN) return null
    this.consume() // =
    const value = this.parseExpression()
    this.expectEnd()
    return { type: 'Assign', name, value }
  }

  private parseBlockBody(): ASTNode[] {
    const body: ASTNode[] = []
    while (this.peek()?.type !== TokenType.END && 
           this.peek()?.type !== TokenType.EOF &&
           this.peek()?.type !== TokenType.ELSE) {
      const stmt = this.parseStatement()
      if (stmt) body.push(stmt)
      if (this.peek()?.type === TokenType.SEMI) this.consume()
      if (this.peek()?.type === TokenType.NEWLINE) this.consume()
    }
    if (this.peek()?.type === TokenType.END) this.consume()
    return body
  }

  private parseExpression(): ASTNode {
    // Simple binary expression for now
    return this.parseComparison()
  }

  private parseComparison(): ASTNode {
    let left = this.parseTerm()
    
    while (this.isCompareOp()) {
      const op = this.consume().value
      const right = this.parseTerm()
      left = { type: 'Binary', operator: op, left, right }
    }
    
    return left
  }

  private parseTerm(): ASTNode {
    let left = this.parseFactor()
    
    while (this.peek()?.type === TokenType.PLUS || 
           this.peek()?.type === TokenType.MINUS) {
      const op = this.consume().value
      const right = this.parseFactor()
      left = { type: 'Binary', operator: op, left, right }
    }
    
    return left
  }

  private parseFactor(): ASTNode {
    if (this.peek()?.type === TokenType.MINUS) {
      this.consume()
      return { type: 'Unary', operator: '-', argument: this.parseFactor() }
    }
    
    if (this.peek()?.type === TokenType.NUMBER) {
      const val = this.consume().value
      return { type: 'Number', value: parseFloat(val) }
    }
    
    if (this.peek()?.type === TokenType.WEIGHT) {
      const val = this.consume().value
      return { type: 'Weight', value: val }
    }
    
    if (this.peek()?.type === TokenType.STRING) {
      const val = this.consume().value
      return { type: 'String', value: val }
    }
    
    if (this.peek()?.type === TokenType.SPATIAL) {
      const val = this.consume().value
      return { type: 'Spatial', value: val }
    }
    
    if (this.peek()?.type === TokenType.WAVEFORM) {
      const val = this.consume().value
      return { type: 'Waveform', value: val }
    }
    
    if (this.peek()?.type === TokenType.IDENTIFIER) {
      const val = this.consume().value
      return { type: 'Identifier', value: val }
    }
    
    if (this.peek()?.type === TokenType.LPAREN) {
      this.consume()
      const expr = this.parseExpression()
      this.consume() // )
      return expr
    }
    
    return { type: 'Null' }
  }

  private isCompareOp(): boolean {
    const t = this.peek()?.type
    return t === TokenType.GT || t === TokenType.LT || 
           t === TokenType.GE || t === TokenType.LE ||
           t === TokenType.EQ || t === TokenType.NE
  }

  private peek(offset: number = 0): Token | undefined {
    return this.tokens[this.pos + offset]
  }

  private consume(): Token {
    return this.tokens[this.pos++]
  }

  private expect(type: TokenType | number): Token | undefined {
    const tok = this.peek()
    if (tok && (tok.type === type || type === -1 || 
        (typeof type === 'number' && tok.type === type))) {
      this.pos++
      return tok
    }
    return undefined
  }

  private expectEnd(): void {
    if (this.peek()?.type === TokenType.SEMI) this.consume()
    if (this.peek()?.type === TokenType.NEWLINE) this.consume()
  }
}