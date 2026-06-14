// Nebulara Core Lexer - Handwritten, dependency-free
// Pure token recognition without Chevrotain

export enum TokenType {
  // Identity markers
  APP, AI, ENTITY, CELL, DATA, RUN, LINK, END,
  FUNC, LOOP, IF, ELSE, THEN, WHILE,
  // Capabilities
  LOGIC, EXECUTE, REFLECT, SHADOW, SHARD, CREATIVE,
  // Keywords
  PRINT, RETURN, SIG, PULSE, MATCH, MESH, FAILSAFE,
  PACKAGE, IMPORT, CLASS, ASYNC, AWAIT,
  // Operators
  ASSIGN, PLUS, MINUS, MUL, DIV, GT, LT, GE, LE, EQ, NE,
  AND, OR, NOT,
  // Literals
  IDENTIFIER, NUMBER, STRING, WEIGHT, SPATIAL, WAVEFORM,
  // Structure
  COLON, SEMI, COMMA, DOT, LPAREN, RPAREN, LBRACE, RBRACE,
  LBRACKET, RBRACKET,
  // End
  EOF, NEWLINE, COMMENT
}

export interface Token {
  type: TokenType
  value: string
  start: number
  end: number
}

const KEYWORDS: Record<string, TokenType> = {
  'APP!': TokenType.APP, 'AI!': TokenType.AI, 'ENTITY!': TokenType.ENTITY,
  'CELL!': TokenType.CELL, 'DATA!': TokenType.DATA, 'RUN!': TokenType.RUN,
  'LINK!': TokenType.LINK, 'END!': TokenType.END, 'FUNC!': TokenType.FUNC,
  'LOOP!': TokenType.LOOP, 'IF?': TokenType.IF, 'ELSE': TokenType.ELSE,
  'THEN': TokenType.THEN, 'WHILE?': TokenType.WHILE, 'PRINT': TokenType.PRINT,
  'RETURN': TokenType.RETURN, 'SIG!': TokenType.SIG, 'PULSE!': TokenType.PULSE,
  'MATCH!': TokenType.MATCH, 'MESH!': TokenType.MESH, 'FAILSAFE!': TokenType.FAILSAFE,
  'PACKAGE!': TokenType.PACKAGE, 'IMPORT!': TokenType.IMPORT, 'CLASS!': TokenType.CLASS,
  'ASYNC!': TokenType.ASYNC, 'AWAIT!': TokenType.AWAIT,
  '@LOGIC': TokenType.LOGIC, '@EXECUTE': TokenType.EXECUTE,
  '@REFLECT': TokenType.REFLECT, '@SHADOW': TokenType.SHADOW,
  '@SHARD': TokenType.SHARD, '@CREATIVE': TokenType.CREATIVE,
  'AND': TokenType.AND, 'OR': TokenType.OR, 'NOT': TokenType.NOT
}

export class NebularaLexer {
  private input: string
  private pos: number = 0

  constructor(input: string) {
    this.input = input
  }

  tokenize(): Token[] {
    const tokens: Token[] = []
    while (this.pos < this.input.length) {
      const token = this.nextToken()
      if (token) tokens.push(token)
    }
    tokens.push({ type: TokenType.EOF, value: '', start: this.pos, end: this.pos })
    return tokens
  }

  private nextToken(): Token | null {
    const c = this.peek()
    
    // Skip whitespace
    if (c === ' ' || c === '\t' || c === '\r') {
      this.consume()
      return this.nextToken()
    }
    
    // Comments
    if (c === '#' || (c === '/' && this.peek(1) === '/')) {
      while (this.pos < this.input.length && this.peek() !== '\n') this.consume()
      return this.nextToken()
    }
    
    // Newline
    if (c === '\n') {
      const start = this.pos
      this.consume()
      return { type: TokenType.NEWLINE, value: '\n', start, end: this.pos }
    }
    
    // Block markers - ELSE: and THEN: (specific patterns BEFORE general uppercase)
    if (c === 'E' && this.peek(1) === 'L' && this.peek(2) === 'S' && this.peek(3) === 'E' && this.peek(4) === ':') {
      for (let i = 0; i < 5; i++) this.consume()
      return { type: TokenType.ELSE, value: 'ELSE:', start: this.pos - 5, end: this.pos }
    }
    if (c === 'T' && this.peek(1) === 'H' && this.peek(2) === 'E' && this.peek(3) === 'N' && this.peek(4) === ':') {
      for (let i = 0; i < 5; i++) this.consume()
      return { type: TokenType.THEN, value: 'THEN:', start: this.pos - 5, end: this.pos }
    }

    // Identity markers - uppercase word followed by !
    if (/[A-Z]/.test(c)) {
      const start = this.pos
      let word = this.consumeUppercaseWord()
      if (this.peek() === '!') {
        this.consume()
        const key = word + '!'
        if (KEYWORDS[key] !== undefined) {
          return { type: KEYWORDS[key], value: key, start, end: this.pos }
        }
        return { type: TokenType.IDENTIFIER, value: key, start, end: this.pos }
      }
      // Check for keyword without !
      if (KEYWORDS[word] !== undefined) {
        return { type: KEYWORDS[word], value: word, start, end: this.pos }
      }
      // Regular identifier
      return { type: TokenType.IDENTIFIER, value: word, start, end: this.pos }
    }

    // Capability tags (@)
    if (c === '@' && /[A-Z]/.test(this.peek(1))) {
      const start = this.pos
      this.consume()
      const word = this.consumeUppercaseWord()
      const key = '@' + word
      if (KEYWORDS[key] !== undefined) {
        return { type: KEYWORDS[key], value: key, start, end: this.pos }
      }
      return { type: TokenType.IDENTIFIER, value: key, start, end: this.pos }
    }

    // Conditional markers - uppercase word followed by ?
    if (c === 'I' && this.peek(1) === 'F' && this.peek(2) === '?') {
      this.consume(); this.consume(); this.consume()
      return { type: TokenType.IF, value: 'IF?', start: this.pos - 3, end: this.pos }
    }
    if (c === 'W' && this.peek(1) === 'H' && this.peek(2) === 'I' && this.peek(3) === 'L' && this.peek(4) === 'E' && this.peek(5) === '?') {
      for (let i = 0; i < 6; i++) this.consume()
      return { type: TokenType.WHILE, value: 'WHILE?', start: this.pos - 6, end: this.pos }
    }

    // String literals
    if (c === '"') return this.readString()

    // Spatial vectors V<...>
    if (c === 'V' && this.peek(1) === '<') return this.readSpatialVector()

    // Waveforms ~...~
    if (c === '~') return this.readWaveform()

    // Numbers
    if (/\d/.test(c)) return this.readNumber()

    // Operators
    if (c === '+' && this.peek(1) === '+') { this.consume(); this.consume(); return this.tok(TokenType.PLUS, '++') }
    if (c === '+' ) return this.tok(TokenType.PLUS)
    if (c === '-') return this.tok(TokenType.MINUS)
    if (c === '*') return this.tok(TokenType.MUL)
    if (c === '/') return this.tok(TokenType.DIV)
    if (c === '=') { 
      if (this.peek(1) === '=') { this.consume(); this.consume(); return this.tok(TokenType.EQ) }
      return this.tok(TokenType.ASSIGN)
    }
    if (c === '>' && this.peek(1) === '=') { this.consume(); this.consume(); return this.tok(TokenType.GE) }
    if (c === '>') return this.tok(TokenType.GT)
    if (c === '<' && this.peek(1) === '=') { this.consume(); this.consume(); return this.tok(TokenType.LE) }
    if (c === '<') return this.tok(TokenType.LT)
    if (c === '!') { 
      if (this.peek(1) === '=') { this.consume(); this.consume(); return this.tok(TokenType.NE) }
      return this.tok(TokenType.ASSIGN) // standalone !
    }
    
    // Punctuation
    if (c === ':') return this.tok(TokenType.COLON)
    if (c === ';') return this.tok(TokenType.SEMI)
    if (c === ',') return this.tok(TokenType.COMMA)
    if (c === '.') return this.tok(TokenType.DOT)
    if (c === '(') return this.tok(TokenType.LPAREN)
    if (c === ')') return this.tok(TokenType.RPAREN)
    if (c === '{') return this.tok(TokenType.LBRACE)
    if (c === '}') return this.tok(TokenType.RBRACE)
    if (c === '[') return this.tok(TokenType.LBRACKET)
    if (c === ']') return this.tok(TokenType.RBRACKET)

    // Identifiers (lowercase)
    if (/[a-z_]/.test(c) || c === '_') return this.readIdentifier()

    this.consume()
    return null
  }

  private readString(): Token {
    const start = this.pos
    this.consume() // "
    let value = ''
    while (this.pos < this.input.length && this.peek() !== '"') {
      if (this.peek() === '\\') {
        this.consume()
        const next = this.peek()
        if (next === 'n') value += '\n'
        else if (next === 't') value += '\t'
        else value += next
      } else {
        value += this.peek()
      }
      this.consume()
    }
    this.consume() // "
    return { type: TokenType.STRING, value, start, end: this.pos }
  }

  private readSpatialVector(): Token {
    const start = this.pos
    this.consume() // V
    this.consume() // <
    let value = ''
    while (this.pos < this.input.length && this.peek() !== '>') {
      value += this.peek()
      this.consume()
    }
    this.consume() // >
    return { type: TokenType.SPATIAL, value: 'V<' + value + '>', start, end: this.pos }
  }

  private readWaveform(): Token {
    const start = this.pos
    this.consume() // ~
    let value = ''
    while (this.pos < this.input.length && this.peek() !== '~') {
      value += this.peek()
      this.consume()
    }
    this.consume() // ~
    return { type: TokenType.WAVEFORM, value: '~' + value + '~', start, end: this.pos }
  }

  private readNumber(): Token {
    const start = this.pos
    let value = this.consumeDigits()
    if (this.peek() === '.' && /\d/.test(this.peek(1))) {
      value += '.'
      this.consume()
      value += this.consumeDigits()
    }
    if (this.peek() === '!' || this.peek() === '?') {
      value += this.peek()
      this.consume()
      return { type: TokenType.WEIGHT, value, start, end: this.pos }
    }
    return { type: TokenType.NUMBER, value, start, end: this.pos }
  }

  private readIdentifier(): Token {
    const start = this.pos
    let value = ''
    while (/[a-zA-Z0-9_]/.test(this.peek())) {
      value += this.peek()
      this.consume()
    }
    return { type: TokenType.IDENTIFIER, value, start, end: this.pos }
  }

  private tock(type: TokenType, char: string): Token {
    const start = this.pos - char.length
    return { type, value: char, start, end: this.pos }
  }

  private peek(offset: number = 0): string {
    return this.input[this.pos + offset] || ''
  }

  private consume(): string {
    return this.input[this.pos++]
  }

  private consumeUppercaseWord(): string {
    let word = ''
    while (/[A-Z0-9_]/.test(this.peek())) {
      word += this.peek()
      this.consume()
    }
    return word
  }

  private consumeDigits(): string {
    let digits = ''
    while (/\d/.test(this.peek())) {
      digits += this.peek()
      this.consume()
    }
    return digits
  }

  private tok(type: TokenType, char: string = ''): Token {
    const start = this.pos - char.length
    return { type, value: char, start, end: this.pos }
  }
}