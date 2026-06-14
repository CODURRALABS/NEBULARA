import { createToken, Lexer } from 'chevrotain'

// ====================================================================
// NEBULARA LANGUAGE TOKENS - CODURRA NEBUXIA V2
// Core identifiers for the universal programming language
// ====================================================================

// Core Identity Markers (! syntax)
export const APP = createToken({ name: 'APP', pattern: /APP!/ })
export const AI = createToken({ name: 'AI', pattern: /AI!/ })
export const DATA = createToken({ name: 'DATA', pattern: /DATA!/ })
export const RUN = createToken({ name: 'RUN', pattern: /RUN!/ })
export const LINK = createToken({ name: 'LINK', pattern: /LINK!/ })
export const CLASS = createToken({ name: 'CLASS', pattern: /CLASS!/ })
export const FUNC = createToken({ name: 'FUNC', pattern: /FUNC!/ })
export const END = createToken({ name: 'END', pattern: /END!/ })
export const LOOP = createToken({ name: 'LOOP', pattern: /LOOP!/ })
export const IMPORT = createToken({ name: 'IMPORT', pattern: /IMPORT!/ })
export const ASYNC = createToken({ name: 'ASYNC', pattern: /ASYNC!/ })
export const AWAIT = createToken({ name: 'AWAIT', pattern: /AWAIT!/ })
export const TRY = createToken({ name: 'TRY', pattern: /TRY!/ })
export const CATCH = createToken({ name: 'CATCH', pattern: /CATCH!/ })
export const THROW = createToken({ name: 'THROW', pattern: /THROW!/ })
export const TYPE = createToken({ name: 'TYPE', pattern: /TYPE!/ })
export const ENTITY = createToken({ name: 'ENTITY', pattern: /ENTITY!/ })
export const CELL = createToken({ name: 'CELL', pattern: /CELL!/ })
export const FAILSAFE = createToken({ name: 'FAILSAFE', pattern: /FAILSAFE!/ })
export const PACKAGE = createToken({ name: 'PACKAGE', pattern: /PACKAGE!/ })
export const MATCH = createToken({ name: 'MATCH', pattern: /MATCH!/ })
export const MESH = createToken({ name: 'MESH', pattern: /MESH!/ })
export const REFLECT = createToken({ name: 'REFLECT', pattern: /REFLECT!/ })
export const SWARM = createToken({ name: 'SWARM', pattern: /SWARM!/ })

// Conditional Markers (? syntax)
export const IF = createToken({ name: 'IF', pattern: /IF\?/ })
export const WHILE = createToken({ name: 'WHILE', pattern: /WHILE\?/ })

// Block Markers (: syntax)
export const THEN = createToken({ name: 'THEN', pattern: /THEN:/ })
export const ELSE = createToken({ name: 'ELSE', pattern: /ELSE:/ })
export const WITH = createToken({ name: 'WITH', pattern: /WITH/ })

// Capability Tags (@ syntax)
export const LOGIC_TAG = createToken({ name: 'LOGIC_TAG', pattern: /@LOGIC/ })
export const EXECUTE_TAG = createToken({ name: 'EXECUTE_TAG', pattern: /@EXECUTE/ })
export const REFLECT_TAG = createToken({ name: 'REFLECT_TAG', pattern: /@REFLECT/ })
export const CREATIVE_TAG = createToken({ name: 'CREATIVE_TAG', pattern: /@CREATIVE/ })
export const SHADOW_TAG = createToken({ name: 'SHADOW_TAG', pattern: /@SHADOW/ })
export const SHARD_TAG = createToken({ name: 'SHARD_TAG', pattern: /@SHARD/ })
export const VIA = createToken({ name: 'VIA', pattern: /VIA/ })

// Protocol & Identity markers
export const SIG = createToken({ name: 'SIG', pattern: /SIG!/ })
export const PULSE = createToken({ name: 'PULSE', pattern: /PULSE!/ })

// Extended Identity Tokens for specialized domains
export const COMPONENT = createToken({ name: 'COMPONENT', pattern: /COMPONENT!/ })
export const MODEL = createToken({ name: 'MODEL', pattern: /MODEL!/ })
export const SCENE = createToken({ name: 'SCENE', pattern: /SCENE!/ })
export const SHADER = createToken({ name: 'SHADER', pattern: /SHADER!/ })
export const PHYSICS = createToken({ name: 'PHYSICS', pattern: /PHYSICS!/ })
export const ANIMATION = createToken({ name: 'ANIMATION', pattern: /ANIMATION!/ })
export const AUDIO = createToken({ name: 'AUDIO', pattern: /AUDIO!/ })
export const TEXTURE = createToken({ name: 'TEXTURE', pattern: /TEXTURE!/ })

// Aurora AI Agent Identifiers
export const CODESMITH = createToken({ name: 'CODESMITH', pattern: /CODESMITH!/ })
export const DEBUGMATRIX = createToken({ name: 'DEBUGMATRIX', pattern: /DEBUGMATRIX!/ })
export const ASSETCRAFTER = createToken({ name: 'ASSETCRAFTER', pattern: /ASSETCRAFTER!/ })
export const AUDIOWEAVER = createToken({ name: 'AUDIOWEAVER', pattern: /AUDIOWEAVER!/ })
export const VISUALIA = createToken({ name: 'VISUALIA', pattern: /VISUALIA!/ })
export const ANIMORA = createToken({ name: 'ANIMORA', pattern: /ANIMORA!/ })
export const MODELFORGE = createToken({ name: 'MODELFORGE', pattern: /MODELFORGE!/ })
export const GAMELOGIC = createToken({ name: 'GAMELOGIC', pattern: /GAMELOGIC!/ })
export const KNOWLEDGECORE = createToken({ name: 'KNOWLEDGECORE', pattern: /KNOWLEDGECORE!/ })

// Keywords
export const PRINT = createToken({ name: 'PRINT', pattern: /PRINT/ })
export const RETURN = createToken({ name: 'RETURN', pattern: /RETURN/ })
export const FETCH = createToken({ name: 'FETCH', pattern: /FETCH/ })
export const STORE = createToken({ name: 'STORE', pattern: /STORE/ })
export const IN = createToken({ name: 'IN', pattern: /IN/ })
export const UNTIL = createToken({ name: 'UNTIL', pattern: /UNTIL/ })
export const AND = createToken({ name: 'AND', pattern: /AND/ })
export const OR = createToken({ name: 'OR', pattern: /OR/ })
export const NOT = createToken({ name: 'NOT', pattern: /NOT/ })
export const CONFIDENCE = createToken({ name: 'CONFIDENCE', pattern: /CONFIDENCE/ })
export const MAJORITY = createToken({ name: 'MAJORITY', pattern: /MAJORITY/ })

// Special Keywords
export const ROLE = createToken({ name: 'ROLE', pattern: /ROLE:/ })
export const FUNCTIONALITY = createToken({ name: 'FUNCTIONALITY', pattern: /FUNCTIONALITY:/ })
export const DEVICE = createToken({ name: 'DEVICE', pattern: /DEVICE/ })

// Operators
export const Assign = createToken({ name: 'Assign', pattern: /=/ })
export const Plus = createToken({ name: 'Plus', pattern: /\+/ })
export const Minus = createToken({ name: 'Minus', pattern: /-/ })
export const Multiply = createToken({ name: 'Multiply', pattern: /\*/ })
export const Divide = createToken({ name: 'Divide', pattern: /\// })
export const GreaterThan = createToken({ name: 'GreaterThan', pattern: />/ })
export const LessThan = createToken({ name: 'LessThan', pattern: /</ })
export const GreaterEqual = createToken({ name: 'GreaterEqual', pattern: />=/ })
export const LessEqual = createToken({ name: 'LessEqual', pattern: /<=/ })
export const Equals = createToken({ name: 'Equals', pattern: /==/ })
export const NotEquals = createToken({ name: 'NotEquals', pattern: /!=/ })

// Optional Punctuation (for flexibility)
export const Comma = createToken({ name: 'Comma', pattern: /,/ })
export const Semicolon = createToken({ name: 'Semicolon', pattern: /;/ })
export const Colon = createToken({ name: 'Colon', pattern: /:/ })
export const Dot = createToken({ name: 'Dot', pattern: /\./ })
export const LParen = createToken({ name: 'LParen', pattern: /\(/ })
export const RParen = createToken({ name: 'RParen', pattern: /\)/ })
export const LBrace = createToken({ name: 'LBrace', pattern: /\{/ })
export const RBrace = createToken({ name: 'RBrace', pattern: /\}/ })
export const LBracket = createToken({ name: 'LBracket', pattern: /\[/ })
export const RBracket = createToken({ name: 'RBracket', pattern: /\]/ })

// Literals
export const StringLiteral = createToken({
  name: 'StringLiteral',
  pattern: /"(?:[^"\\]|\\.)*"/
})

export const NumberLiteral = createToken({
  name: 'NumberLiteral',
  pattern: /\d+(\.\d+)?/
})

// Literals (Weight-Based Probability over Legacy Boolean)
export const WeightLiteral = createToken({
  name: 'WeightLiteral',
  pattern: /\d+(\.\d+)?(!|\?)/ 
})

export const SpatialVector = createToken({
  name: 'SpatialVector',
  pattern: /V<[0-9.,-]+>/
})

export const WaveformLiteral = createToken({
  name: 'WaveformLiteral',
  pattern: /~[0-9A-Fa-f]+~/
})

// Identifiers (variable names, function names, etc.)
export const Identifier = createToken({
  name: 'Identifier',
  pattern: /[a-zA-Z_][a-zA-Z0-9_]*/
})

// Whitespace (Lexer skipping for standard whitespace)
export const WhiteSpace = createToken({
  name: 'WhiteSpace',
  pattern: /[ \t]+/,
  group: Lexer.SKIPPED
})

export const NewLine = createToken({
  name: 'NewLine',
  pattern: /\r?\n/,
  line_breaks: true
})

// Comments
export const Comment = createToken({
  name: 'Comment',
  pattern: /#.*|\/\/.*|\/\*[\s\S]*?\*\//,
  group: Lexer.SKIPPED
})

// All tokens in priority order
export const allNebularaTokens = [
  // Comments and whitespace first
  Comment,
  WhiteSpace,
  
  // Core identity markers (highest priority)
  APP, AI, ENTITY, CELL, DATA, RUN, LINK, IMPORT, CLASS, FUNC, END, LOOP,
  ASYNC, AWAIT, TRY, CATCH, THROW, TYPE, FAILSAFE, PACKAGE, MATCH, MESH, REFLECT, SWARM,
  
  // Capability Tags
  LOGIC_TAG, EXECUTE_TAG, REFLECT_TAG, CREATIVE_TAG, SHADOW_TAG, SHARD_TAG, VIA,
  SIG, PULSE,
  
  // Conditional markers
  IF, WHILE, THEN, ELSE,
  
  // Extended identity tokens
  COMPONENT, MODEL, SCENE, SHADER, PHYSICS, ANIMATION, AUDIO, TEXTURE,
  
  // Aurora AI agents
  CODESMITH, DEBUGMATRIX, ASSETCRAFTER, AUDIOWEAVER, VISUALIA, ANIMORA,
  MODELFORGE, GAMELOGIC, KNOWLEDGECORE,
  
  // Special keywords
  ROLE, FUNCTIONALITY,
  
  // Regular keywords
  PRINT, RETURN, FETCH, STORE, IN, UNTIL, AND, OR, NOT, WITH, DEVICE,
  CONFIDENCE, MAJORITY,
  
  // Operators (longer patterns first)
  GreaterEqual, LessEqual, Equals, NotEquals,
  GreaterThan, LessThan, Assign, Plus, Minus, Multiply, Divide,
  
  // Punctuation
  Comma, Semicolon, Colon, Dot,
  LParen, RParen, LBrace, RBrace, LBracket, RBracket,
  
  // Literals
  WeightLiteral, NumberLiteral, StringLiteral, SpatialVector, WaveformLiteral,
  
  // Identifiers (last)
  Identifier,
  
  // Line structure
  NewLine
]

export const NebularaLexer = new Lexer(allNebularaTokens, {
  positionTracking: 'full'
})