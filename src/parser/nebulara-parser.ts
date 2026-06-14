/**
 * NEBULARA PARSER - Complete Implementation
 * CODURRA NEBUXIA V2
 * 
 * Parses Nebulara code into Abstract Syntax Tree (AST)
 */

import { CstParser } from 'chevrotain'
import {
  allNebularaTokens,
  APP, AI, ENTITY, CELL, DATA, RUN, LINK, IMPORT, CLASS, FUNC, END, LOOP,
  ASYNC, AWAIT, TRY, CATCH, THROW, TYPE, FAILSAFE, PACKAGE, MATCH, MESH, REFLECT, SWARM,
  CONFIDENCE, MAJORITY,
  IF, WHILE, THEN, ELSE, WITH,
  LOGIC_TAG, EXECUTE_TAG, REFLECT_TAG, CREATIVE_TAG, SHADOW_TAG, SHARD_TAG, VIA,
  SIG, PULSE,
  COMPONENT, MODEL, SCENE, SHADER, PHYSICS, ANIMATION, AUDIO, TEXTURE,
  CODESMITH, DEBUGMATRIX, ASSETCRAFTER, AUDIOWEAVER, VISUALIA, ANIMORA,
  MODELFORGE, GAMELOGIC, KNOWLEDGECORE,
  PRINT, RETURN, FETCH, STORE, IN, UNTIL, AND, OR, NOT,
  ROLE, FUNCTIONALITY, DEVICE,
  Assign, Plus, Minus, Multiply, Divide,
  GreaterThan, LessThan, GreaterEqual, LessEqual, Equals, NotEquals,
  Comma, Semicolon, Colon, Dot,
  LParen, RParen, LBrace, RBrace, LBracket, RBracket,
  StringLiteral, NumberLiteral, WeightLiteral, SpatialVector, WaveformLiteral, Identifier,
  NewLine
} from '../lexer/nebulara-tokens.js'

export class NebularaParser extends CstParser {
  constructor() {
    super(allNebularaTokens, {
      recoveryEnabled: true,
      nodeLocationTracking: 'full',
      maxLookahead: 4
    })
    this.performSelfAnalysis()
  }

  // ====================================================================
  // ROOT RULE - Program Entry Point
  // ====================================================================

  program = this.RULE('program', () => {
    this.MANY(() => {
      this.OR([
        { ALT: () => this.SUBRULE(this.statement) },
        { ALT: () => this.CONSUME(NewLine) }
      ])
    })
  })

  // ====================================================================
  // STATEMENTS
  // ====================================================================

  statement = this.RULE('statement', () => {
    this.OR({
      IGNORE_AMBIGUITIES: true,
      DEF: [
        { ALT: () => this.SUBRULE(this.appDeclaration) },
        { ALT: () => this.SUBRULE(this.packageDeclaration) },
        { ALT: () => this.SUBRULE(this.aiDeclaration) },
        { ALT: () => this.SUBRULE(this.entityDeclaration) },
        { ALT: () => this.SUBRULE(this.cellDeclaration) },
        { ALT: () => this.SUBRULE(this.dataDeclaration) },
        { ALT: () => this.SUBRULE(this.runBlock) },
        { ALT: () => this.SUBRULE(this.failsafeStatement) },
        { ALT: () => this.SUBRULE(this.linkStatement) },
        { ALT: () => this.SUBRULE(this.importStatement) },
        { ALT: () => this.SUBRULE(this.classDeclaration) },
        { ALT: () => this.SUBRULE(this.funcDeclaration) },
        { ALT: () => this.SUBRULE(this.componentDeclaration) },
        { ALT: () => this.SUBRULE(this.modelDeclaration) },
        { ALT: () => this.SUBRULE(this.sceneDeclaration) },
        { ALT: () => this.SUBRULE(this.asyncFuncDeclaration) },
        { ALT: () => this.SUBRULE(this.tryCatchStatement) },
        { ALT: () => this.SUBRULE(this.throwStatement) },
        { ALT: () => this.SUBRULE(this.typeDeclaration) },
        { ALT: () => this.SUBRULE(this.ifStatement) },
        { ALT: () => this.SUBRULE(this.whileStatement) },
        { ALT: () => this.SUBRULE(this.loopStatement) },
        { ALT: () => this.SUBRULE(this.printStatement) },
        { ALT: () => this.SUBRULE(this.pulseStatement) },
        { ALT: () => this.SUBRULE(this.signatureStatement) },
        { ALT: () => this.SUBRULE(this.returnStatement) },
        { ALT: () => this.SUBRULE(this.storeStatement) },
        { ALT: () => this.SUBRULE(this.matchStatement) },
        { ALT: () => this.SUBRULE(this.meshBlock) },
        { ALT: () => this.SUBRULE(this.reflectBlock) },
        { ALT: () => this.SUBRULE(this.expressionStatement) }
      ]
    })
    this.OPTION(() => this.CONSUME(Semicolon)) // Optional semicolon
  })

  // ====================================================================
  // CORE DECLARATIONS
  // ====================================================================

  appDeclaration = this.RULE('appDeclaration', () => {
    this.CONSUME(APP)
    this.CONSUME(StringLiteral)
    this.MANY(() => {
      this.OR([
        { ALT: () => this.SUBRULE(this.statement) },
        { ALT: () => this.CONSUME(NewLine) }
      ])
    })
    this.OPTION(() => this.CONSUME(END))
  })

  aiDeclaration = this.RULE('aiDeclaration', () => {
    this.CONSUME(AI)
    this.OPTION(() => {
      this.OR([
        { ALT: () => this.CONSUME(LOGIC_TAG) },
        { ALT: () => this.CONSUME(EXECUTE_TAG) },
        { ALT: () => this.CONSUME(REFLECT_TAG) },
        { ALT: () => this.CONSUME(CREATIVE_TAG) },
        { ALT: () => this.CONSUME(SHADOW_TAG) },
        { ALT: () => this.CONSUME(SHARD_TAG) }
      ])
    })
    this.OPTION2(() => {
      this.CONSUME(VIA)
      this.CONSUME(LParen)
      this.OR2([
        { ALT: () => this.CONSUME(Identifier) },
        { ALT: () => this.CONSUME(StringLiteral) }
      ])
      this.CONSUME(RParen)
    })
    this.OR3([
      { ALT: () => this.CONSUME2(StringLiteral) },
      { ALT: () => this.CONSUME2(Identifier) }
    ])
    this.MANY(() => {
      this.OR4({
        IGNORE_AMBIGUITIES: true,
        DEF: [
          { ALT: () => this.SUBRULE(this.roleStatement) },
          { ALT: () => this.SUBRULE(this.functionalityStatement) },
          { ALT: () => this.SUBRULE(this.statement) },
          { ALT: () => this.CONSUME(NewLine) }
        ]
      })
    })
    this.OPTION3(() => this.CONSUME(END))
  })

  entityDeclaration = this.RULE('entityDeclaration', () => {
    this.CONSUME(ENTITY)
    this.OR([
      { ALT: () => this.CONSUME(Identifier) },
      { ALT: () => this.CONSUME(StringLiteral) }
    ])
    this.MANY(() => {
      this.OR2([
        { ALT: () => this.SUBRULE(this.statement) },
        { ALT: () => this.CONSUME(NewLine) }
      ])
    })
    this.OPTION(() => this.CONSUME(END))
  })

  cellDeclaration = this.RULE('cellDeclaration', () => {
    this.CONSUME(CELL)
    this.OR([
      { ALT: () => this.CONSUME(Identifier) },
      { ALT: () => this.CONSUME(StringLiteral) }
    ])
    this.MANY(() => {
      this.OR2([
        { ALT: () => this.SUBRULE(this.statement) },
        { ALT: () => this.CONSUME(NewLine) }
      ])
    })
    this.OPTION(() => this.CONSUME(END))
  })

  dataDeclaration = this.RULE('dataDeclaration', () => {
    this.CONSUME(DATA)
    this.OPTION(() => this.CONSUME(SHARD_TAG))
    this.CONSUME(Identifier)
    this.MANY(() => {
      this.OR([
        { ALT: () => this.SUBRULE(this.assignment) },
        { ALT: () => this.CONSUME(NewLine) }
      ])
    })
    this.OPTION2(() => this.CONSUME(END))
  })

  runBlock = this.RULE('runBlock', () => {
    this.CONSUME(RUN)
    this.MANY(() => {
      this.OR([
        { ALT: () => this.SUBRULE(this.statement) },
        { ALT: () => this.CONSUME(NewLine) }
      ])
    })
    this.OPTION(() => this.CONSUME(END))
  })

  linkStatement = this.RULE('linkStatement', () => {
    this.CONSUME(LINK)
    this.CONSUME(StringLiteral)
  })

  importStatement = this.RULE('importStatement', () => {
    this.CONSUME(IMPORT)
    this.CONSUME(StringLiteral)
  })

  classDeclaration = this.RULE('classDeclaration', () => {
    this.CONSUME(CLASS)
    this.CONSUME(StringLiteral)
    this.MANY(() => {
      this.OR([
        { ALT: () => this.SUBRULE(this.statement) },
        { ALT: () => this.CONSUME(NewLine) }
      ])
    })
    this.OPTION(() => this.CONSUME(END))
  })

  funcDeclaration = this.RULE('funcDeclaration', () => {
    this.CONSUME(FUNC)
    this.CONSUME(StringLiteral)
    this.OPTION(() => {
      this.CONSUME(WITH)
      this.SUBRULE(this.parameterList)
    })
    this.MANY(() => {
      this.OR([
        { ALT: () => this.SUBRULE(this.statement) },
        { ALT: () => this.CONSUME(NewLine) }
      ])
    })
    this.OPTION2(() => this.CONSUME(END))
  })

  asyncFuncDeclaration = this.RULE('asyncFuncDeclaration', () => {
    this.CONSUME(ASYNC)
    this.CONSUME(FUNC)
    this.CONSUME(StringLiteral)
    this.OPTION(() => {
      this.CONSUME(WITH)
      this.SUBRULE(this.parameterList)
    })
    this.MANY(() => {
      this.OR([
        { ALT: () => this.SUBRULE(this.statement) },
        { ALT: () => this.CONSUME(NewLine) }
      ])
    })
    this.OPTION2(() => this.CONSUME(END))
  })

  // ====================================================================
  // EXTENDED DECLARATIONS
  // ====================================================================

  componentDeclaration = this.RULE('componentDeclaration', () => {
    this.CONSUME(COMPONENT)
    this.CONSUME(StringLiteral)
    this.MANY(() => {
      this.OR([
        { ALT: () => this.SUBRULE(this.statement) },
        { ALT: () => this.CONSUME(NewLine) }
      ])
    })
    this.OPTION(() => this.CONSUME(END))
  })

  modelDeclaration = this.RULE('modelDeclaration', () => {
    this.CONSUME(MODEL)
    this.CONSUME(StringLiteral)
    this.MANY(() => {
      this.OR([
        { ALT: () => this.SUBRULE(this.statement) },
        { ALT: () => this.CONSUME(NewLine) }
      ])
    })
    this.OPTION(() => this.CONSUME(END))
  })

  sceneDeclaration = this.RULE('sceneDeclaration', () => {
    this.CONSUME(SCENE)
    this.CONSUME(StringLiteral)
    this.MANY(() => {
      this.OR([
        { ALT: () => this.SUBRULE(this.statement) },
        { ALT: () => this.CONSUME(NewLine) }
      ])
    })
    this.OPTION(() => this.CONSUME(END))
  })

  // ====================================================================
  // CONTROL FLOW
  // ====================================================================

  ifStatement = this.RULE('ifStatement', () => {
    this.CONSUME(IF)
    this.SUBRULE(this.expression)
    this.CONSUME(THEN)
    this.MANY(() => {
      this.OR([
        { ALT: () => this.SUBRULE2(this.statement) },
        { ALT: () => this.CONSUME(NewLine) }
      ])
    })
    this.OPTION(() => {
      this.CONSUME(ELSE)
      this.MANY2(() => {
        this.OR2([
          { ALT: () => this.SUBRULE3(this.statement) },
          { ALT: () => this.CONSUME2(NewLine) }
        ])
      })
    })
    this.OPTION2(() => this.CONSUME(END))
  })

  whileStatement = this.RULE('whileStatement', () => {
    this.CONSUME(WHILE)
    this.SUBRULE(this.expression)
    this.MANY(() => {
      this.OR([
        { ALT: () => this.SUBRULE2(this.statement) },
        { ALT: () => this.CONSUME(NewLine) }
      ])
    })
    this.OPTION(() => this.CONSUME(END))
  })

  tryCatchStatement = this.RULE('tryCatchStatement', () => {
    this.CONSUME(TRY)
    this.MANY(() => {
      this.OR([
        { ALT: () => this.SUBRULE(this.statement) },
        { ALT: () => this.CONSUME(NewLine) }
      ])
    })
    this.CONSUME(CATCH)
    this.OPTION(() => {
      this.CONSUME(WITH)
      this.SUBRULE(this.parameterList)
    })
    this.MANY2(() => {
      this.OR2([
        { ALT: () => this.SUBRULE2(this.statement) },
        { ALT: () => this.CONSUME2(NewLine) }
      ])
    })
    this.OPTION2(() => this.CONSUME(END))
  })

  loopStatement = this.RULE('loopStatement', () => {
    this.CONSUME(LOOP)
    this.MANY(() => {
      this.OR([
        { ALT: () => this.SUBRULE(this.statement) },
        { ALT: () => this.CONSUME(NewLine) }
      ])
    })
    this.OPTION(() => this.CONSUME(END))
  })

  // ====================================================================
  // SPECIAL STATEMENTS
  // ====================================================================

  roleStatement = this.RULE('roleStatement', () => {
    this.CONSUME(ROLE)
    this.CONSUME(StringLiteral)
  })

  functionalityStatement = this.RULE('functionalityStatement', () => {
    this.CONSUME(FUNCTIONALITY)
    this.CONSUME(StringLiteral)
  })

  failsafeStatement = this.RULE('failsafeStatement', () => {
    this.CONSUME(FAILSAFE)
    this.MANY(() => {
      this.OR([
        { ALT: () => this.SUBRULE(this.statement) },
        { ALT: () => this.CONSUME(NewLine) }
      ])
    })
    this.OPTION(() => this.CONSUME(END))
  })

  pulseStatement = this.RULE('pulseStatement', () => {
    this.CONSUME(PULSE)
    this.OPTION(() => this.SUBRULE(this.expression))
  })

  signatureStatement = this.RULE('signatureStatement', () => {
    this.CONSUME(SIG)
    this.CONSUME(Identifier)
  })

  printStatement = this.RULE('printStatement', () => {
    this.CONSUME(PRINT)
    this.SUBRULE(this.expression)
  })

  returnStatement = this.RULE('returnStatement', () => {
    this.CONSUME(RETURN)
    this.OPTION(() => this.SUBRULE(this.expression))
  })

  throwStatement = this.RULE('throwStatement', () => {
    this.CONSUME(THROW)
    this.SUBRULE(this.expression)
  })

  typeDeclaration = this.RULE('typeDeclaration', () => {
    this.CONSUME(TYPE)
    this.CONSUME(Identifier) // The type (e.g., number)
    this.CONSUME2(Identifier) // The name (e.g., myVar)
    this.OPTION(() => {
      this.CONSUME(Assign)
      this.SUBRULE(this.expression)
    })
  })

  storeStatement = this.RULE('storeStatement', () => {
    this.CONSUME(STORE)
    this.CONSUME(StringLiteral)
    this.CONSUME(IN)
    this.CONSUME(DEVICE)
    this.OPTION(() => {
      this.CONSUME(UNTIL)
      this.CONSUME2(StringLiteral)
    })
  })

  // ====================================================================
  // EXPRESSIONS
  // ====================================================================

  expressionStatement = this.RULE('expressionStatement', () => {
    this.SUBRULE(this.expression)
  })

  expression = this.RULE('expression', () => {
    this.SUBRULE(this.logicalExpression)
  })

  logicalExpression = this.RULE('logicalExpression', () => {
    this.SUBRULE(this.comparisonExpression)
    this.MANY(() => {
      this.OR([
        { ALT: () => this.CONSUME(AND) },
        { ALT: () => this.CONSUME(OR) }
      ])
      this.SUBRULE2(this.comparisonExpression)
    })
  })

  comparisonExpression = this.RULE('comparisonExpression', () => {
    this.SUBRULE(this.additiveExpression)
    this.MANY(() => {
      this.OR([
        { ALT: () => this.CONSUME(Equals) },
        { ALT: () => this.CONSUME(NotEquals) },
        { ALT: () => this.CONSUME(GreaterThan) },
        { ALT: () => this.CONSUME(LessThan) },
        { ALT: () => this.CONSUME(GreaterEqual) },
        { ALT: () => this.CONSUME(LessEqual) }
      ])
      this.SUBRULE2(this.additiveExpression)
    })
  })

  additiveExpression = this.RULE('additiveExpression', () => {
    this.SUBRULE(this.multiplicativeExpression)
    this.MANY(() => {
      this.OR([
        { ALT: () => this.CONSUME(Plus) },
        { ALT: () => this.CONSUME(Minus) }
      ])
      this.SUBRULE2(this.multiplicativeExpression)
    })
  })

  multiplicativeExpression = this.RULE('multiplicativeExpression', () => {
    this.SUBRULE(this.unaryExpression)
    this.MANY(() => {
      this.OR([
        { ALT: () => this.CONSUME(Multiply) },
        { ALT: () => this.CONSUME(Divide) }
      ])
      this.SUBRULE2(this.unaryExpression)
    })
  })

  unaryExpression = this.RULE('unaryExpression', () => {
    this.OR([
      {
        ALT: () => {
          this.CONSUME(NOT)
          this.SUBRULE(this.unaryExpression)
        }
      },
      { ALT: () => this.SUBRULE(this.primaryExpression) }
    ])
  })

  primaryExpression = this.RULE('primaryExpression', () => {
    this.OR([
      { ALT: () => this.CONSUME(NumberLiteral) },
      { ALT: () => this.CONSUME(StringLiteral) },
      { ALT: () => this.CONSUME(WeightLiteral) },
      { ALT: () => this.CONSUME(SpatialVector) },
      { ALT: () => this.CONSUME(WaveformLiteral) },
      { ALT: () => this.SUBRULE(this.identifierExpression) },
      { ALT: () => this.SUBRULE(this.arrayLiteral) },
      { ALT: () => this.SUBRULE(this.objectLiteral) },
      {
        ALT: () => {
          this.CONSUME(LParen)
          this.SUBRULE(this.expression)
          this.CONSUME(RParen)
        }
      },
      {
        ALT: () => {
          this.CONSUME(AWAIT)
          this.SUBRULE2(this.expression)
        }
      }
    ])
  })

  identifierExpression = this.RULE('identifierExpression', () => {
    this.CONSUME(Identifier)
    this.MANY(() => {
      this.OR([
        {
          ALT: () => {
            this.CONSUME(Dot)
            this.CONSUME2(Identifier)
          }
        },
        {
          ALT: () => {
            this.CONSUME(LBracket)
            this.SUBRULE(this.expression)
            this.CONSUME(RBracket)
          }
        },
        { ALT: () => this.SUBRULE(this.functionCall) }
      ])
    })
  })

  functionCall = this.RULE('functionCall', () => {
    this.CONSUME(LParen)
    this.OPTION(() => this.SUBRULE(this.argumentList))
    this.CONSUME(RParen)
  })

  // ====================================================================
  // HELPERS
  // ====================================================================

  assignment = this.RULE('assignment', () => {
    this.CONSUME(Identifier)
    this.CONSUME(Assign)
    this.SUBRULE(this.expression)
  })

  parameterList = this.RULE('parameterList', () => {
    this.OPTION(() => this.CONSUME(LParen))
    this.OPTION2(() => {
      this.CONSUME(Identifier)
      this.MANY(() => {
        this.OPTION3(() => this.CONSUME(Comma))
        this.CONSUME2(Identifier)
      })
    })
    this.OPTION4(() => this.CONSUME(RParen))
  })

  argumentList = this.RULE('argumentList', () => {
    this.SUBRULE(this.expression)
    this.MANY(() => {
      this.OPTION(() => this.CONSUME(Comma))
      this.SUBRULE2(this.expression)
    })
  })

  arrayLiteral = this.RULE('arrayLiteral', () => {
    this.CONSUME(LBracket)
    this.OPTION(() => {
      this.SUBRULE(this.expression)
      this.MANY(() => {
        this.OPTION2(() => this.CONSUME(Comma))
        this.SUBRULE2(this.expression)
      })
    })
    this.CONSUME(RBracket)
  })

  objectLiteral = this.RULE('objectLiteral', () => {
    this.CONSUME(LBrace)
    this.OPTION(() => {
      this.SUBRULE(this.objectProperty)
      this.MANY(() => {
        this.OPTION2(() => this.CONSUME(Comma))
        this.SUBRULE2(this.objectProperty)
      })
    })
    this.CONSUME(RBrace)
  })

  objectProperty = this.RULE('objectProperty', () => {
    this.OR([
      { ALT: () => this.CONSUME(Identifier) },
      { ALT: () => this.CONSUME(StringLiteral) }
    ])
    this.OPTION(() => this.CONSUME(Colon))
    this.SUBRULE(this.expression)
  })

  packageDeclaration = this.RULE('packageDeclaration', () => {
    this.CONSUME(PACKAGE)
    this.CONSUME(StringLiteral)
    this.OPTION(() => {
        this.CONSUME(SIG)
        this.CONSUME(Identifier)
    })
    this.MANY(() => {
        this.OR([
            { ALT: () => this.SUBRULE(this.statement) },
            { ALT: () => this.CONSUME(NewLine) }
        ])
    })
    this.CONSUME(END)
  })

  matchStatement = this.RULE('matchStatement', () => {
    this.CONSUME(MATCH)
    this.SUBRULE(this.expression)
    this.OPTION(() => {
        this.CONSUME(WITH)
        this.CONSUME(WeightLiteral)
    })
  })

  meshBlock = this.RULE('meshBlock', () => {
    this.CONSUME(MESH)
    this.OPTION(() => {
        this.CONSUME(WITH)
        this.OR([
            { ALT: () => this.CONSUME(CONFIDENCE) },
            { ALT: () => this.CONSUME(MAJORITY) }
        ])
    })
    this.MANY(() => {
        this.OR2([
            { ALT: () => this.SUBRULE(this.statement) },
            { ALT: () => this.CONSUME(NewLine) }
        ])
    })
    this.MANY2(() => {
        this.OR3([
            { ALT: () => this.CONSUME(NewLine) }
        ])
    })
    this.CONSUME(END)
  })

  reflectBlock = this.RULE('reflectBlock', () => {
    this.CONSUME(REFLECT)
    this.MANY(() => {
        this.OR([
            { ALT: () => this.SUBRULE(this.statement) },
            { ALT: () => this.CONSUME(NewLine) }
        ])
    })
    this.CONSUME(END)
  })
}

// Create parser instance
export const nebularaParser = new NebularaParser()