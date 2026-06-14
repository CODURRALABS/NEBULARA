"use strict";
/**
 * NEBULARA PARSER - Complete Implementation
 * CODURRA NEBUXIA V2
 *
 * Parses Nebulara code into Abstract Syntax Tree (AST)
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.nebularaParser = exports.NebularaParser = void 0;
const chevrotain_1 = require("chevrotain");
const nebulara_tokens_1 = require("../lexer/nebulara-tokens");
class NebularaParser extends chevrotain_1.CstParser {
    constructor() {
        super(nebulara_tokens_1.allNebularaTokens, {
            recoveryEnabled: true,
            nodeLocationTracking: 'full'
        });
        // ====================================================================
        // ROOT RULE - Program Entry Point
        // ====================================================================
        this.program = this.RULE('program', () => {
            this.MANY(() => {
                this.OR([
                    { ALT: () => this.SUBRULE(this.statement) },
                    { ALT: () => this.CONSUME(nebulara_tokens_1.NewLine) }
                ]);
            });
        });
        // ====================================================================
        // STATEMENTS
        // ====================================================================
        this.statement = this.RULE('statement', () => {
            this.OR([
                { ALT: () => this.SUBRULE(this.appDeclaration) },
                { ALT: () => this.SUBRULE(this.aiDeclaration) },
                { ALT: () => this.SUBRULE(this.dataDeclaration) },
                { ALT: () => this.SUBRULE(this.runBlock) },
                { ALT: () => this.SUBRULE(this.linkStatement) },
                { ALT: () => this.SUBRULE(this.classDeclaration) },
                { ALT: () => this.SUBRULE(this.funcDeclaration) },
                { ALT: () => this.SUBRULE(this.componentDeclaration) },
                { ALT: () => this.SUBRULE(this.modelDeclaration) },
                { ALT: () => this.SUBRULE(this.sceneDeclaration) },
                { ALT: () => this.SUBRULE(this.ifStatement) },
                { ALT: () => this.SUBRULE(this.whileStatement) },
                { ALT: () => this.SUBRULE(this.loopStatement) },
                { ALT: () => this.SUBRULE(this.printStatement) },
                { ALT: () => this.SUBRULE(this.returnStatement) },
                { ALT: () => this.SUBRULE(this.storeStatement) },
                { ALT: () => this.SUBRULE(this.expressionStatement) }
            ]);
            this.OPTION(() => this.CONSUME(nebulara_tokens_1.Semicolon)); // Optional semicolon
        });
        // ====================================================================
        // CORE DECLARATIONS
        // ====================================================================
        this.appDeclaration = this.RULE('appDeclaration', () => {
            this.CONSUME(nebulara_tokens_1.APP);
            this.CONSUME(nebulara_tokens_1.StringLiteral);
            this.MANY(() => {
                this.OR([
                    { ALT: () => this.SUBRULE(this.statement) },
                    { ALT: () => this.CONSUME(nebulara_tokens_1.NewLine) }
                ]);
            });
            this.OPTION(() => this.CONSUME(nebulara_tokens_1.END));
        });
        this.aiDeclaration = this.RULE('aiDeclaration', () => {
            this.CONSUME(nebulara_tokens_1.AI);
            this.CONSUME(nebulara_tokens_1.StringLiteral);
            this.MANY(() => {
                this.OR([
                    { ALT: () => this.SUBRULE(this.roleStatement) },
                    { ALT: () => this.SUBRULE(this.functionalityStatement) },
                    { ALT: () => this.SUBRULE(this.statement) },
                    { ALT: () => this.CONSUME(nebulara_tokens_1.NewLine) }
                ]);
            });
            this.OPTION(() => this.CONSUME(nebulara_tokens_1.END));
        });
        this.dataDeclaration = this.RULE('dataDeclaration', () => {
            this.CONSUME(nebulara_tokens_1.DATA);
            this.CONSUME(nebulara_tokens_1.Identifier);
            this.MANY(() => {
                this.OR([
                    { ALT: () => this.SUBRULE(this.assignment) },
                    { ALT: () => this.CONSUME(nebulara_tokens_1.NewLine) }
                ]);
            });
            this.OPTION(() => this.CONSUME(nebulara_tokens_1.END));
        });
        this.runBlock = this.RULE('runBlock', () => {
            this.CONSUME(nebulara_tokens_1.RUN);
            this.MANY(() => {
                this.OR([
                    { ALT: () => this.SUBRULE(this.statement) },
                    { ALT: () => this.CONSUME(nebulara_tokens_1.NewLine) }
                ]);
            });
            this.OPTION(() => this.CONSUME(nebulara_tokens_1.END));
        });
        this.linkStatement = this.RULE('linkStatement', () => {
            this.CONSUME(nebulara_tokens_1.LINK);
            this.CONSUME(nebulara_tokens_1.StringLiteral);
        });
        this.classDeclaration = this.RULE('classDeclaration', () => {
            this.CONSUME(nebulara_tokens_1.CLASS);
            this.CONSUME(nebulara_tokens_1.StringLiteral);
            this.MANY(() => {
                this.OR([
                    { ALT: () => this.SUBRULE(this.statement) },
                    { ALT: () => this.CONSUME(nebulara_tokens_1.NewLine) }
                ]);
            });
            this.OPTION(() => this.CONSUME(nebulara_tokens_1.END));
        });
        this.funcDeclaration = this.RULE('funcDeclaration', () => {
            this.CONSUME(nebulara_tokens_1.FUNC);
            this.CONSUME(nebulara_tokens_1.StringLiteral);
            this.OPTION(() => {
                this.CONSUME(nebulara_tokens_1.WITH);
                this.SUBRULE(this.parameterList);
            });
            this.MANY(() => {
                this.OR([
                    { ALT: () => this.SUBRULE(this.statement) },
                    { ALT: () => this.CONSUME(nebulara_tokens_1.NewLine) }
                ]);
            });
            this.OPTION2(() => this.CONSUME(nebulara_tokens_1.END));
        });
        // ====================================================================
        // EXTENDED DECLARATIONS
        // ====================================================================
        this.componentDeclaration = this.RULE('componentDeclaration', () => {
            this.CONSUME(nebulara_tokens_1.COMPONENT);
            this.CONSUME(nebulara_tokens_1.StringLiteral);
            this.MANY(() => {
                this.OR([
                    { ALT: () => this.SUBRULE(this.statement) },
                    { ALT: () => this.CONSUME(nebulara_tokens_1.NewLine) }
                ]);
            });
            this.OPTION(() => this.CONSUME(nebulara_tokens_1.END));
        });
        this.modelDeclaration = this.RULE('modelDeclaration', () => {
            this.CONSUME(nebulara_tokens_1.MODEL);
            this.CONSUME(nebulara_tokens_1.StringLiteral);
            this.MANY(() => {
                this.OR([
                    { ALT: () => this.SUBRULE(this.statement) },
                    { ALT: () => this.CONSUME(nebulara_tokens_1.NewLine) }
                ]);
            });
            this.OPTION(() => this.CONSUME(nebulara_tokens_1.END));
        });
        this.sceneDeclaration = this.RULE('sceneDeclaration', () => {
            this.CONSUME(nebulara_tokens_1.SCENE);
            this.CONSUME(nebulara_tokens_1.StringLiteral);
            this.MANY(() => {
                this.OR([
                    { ALT: () => this.SUBRULE(this.statement) },
                    { ALT: () => this.CONSUME(nebulara_tokens_1.NewLine) }
                ]);
            });
            this.OPTION(() => this.CONSUME(nebulara_tokens_1.END));
        });
        // ====================================================================
        // CONTROL FLOW
        // ====================================================================
        this.ifStatement = this.RULE('ifStatement', () => {
            this.CONSUME(nebulara_tokens_1.IF);
            this.SUBRULE(this.expression);
            this.CONSUME(nebulara_tokens_1.THEN);
            this.MANY(() => {
                this.OR([
                    { ALT: () => this.SUBRULE2(this.statement) },
                    { ALT: () => this.CONSUME(nebulara_tokens_1.NewLine) }
                ]);
            });
            this.OPTION(() => {
                this.CONSUME(nebulara_tokens_1.ELSE);
                this.MANY2(() => {
                    this.OR2([
                        { ALT: () => this.SUBRULE3(this.statement) },
                        { ALT: () => this.CONSUME2(nebulara_tokens_1.NewLine) }
                    ]);
                });
            });
            this.OPTION2(() => this.CONSUME(nebulara_tokens_1.END));
        });
        this.whileStatement = this.RULE('whileStatement', () => {
            this.CONSUME(nebulara_tokens_1.WHILE);
            this.SUBRULE(this.expression);
            this.MANY(() => {
                this.OR([
                    { ALT: () => this.SUBRULE2(this.statement) },
                    { ALT: () => this.CONSUME(nebulara_tokens_1.NewLine) }
                ]);
            });
            this.OPTION(() => this.CONSUME(nebulara_tokens_1.END));
        });
        this.loopStatement = this.RULE('loopStatement', () => {
            this.CONSUME(nebulara_tokens_1.LOOP);
            this.MANY(() => {
                this.OR([
                    { ALT: () => this.SUBRULE(this.statement) },
                    { ALT: () => this.CONSUME(nebulara_tokens_1.NewLine) }
                ]);
            });
            this.OPTION(() => this.CONSUME(nebulara_tokens_1.END));
        });
        // ====================================================================
        // SPECIAL STATEMENTS
        // ====================================================================
        this.roleStatement = this.RULE('roleStatement', () => {
            this.CONSUME(nebulara_tokens_1.ROLE);
            this.CONSUME(nebulara_tokens_1.StringLiteral);
        });
        this.functionalityStatement = this.RULE('functionalityStatement', () => {
            this.CONSUME(nebulara_tokens_1.FUNCTIONALITY);
            this.CONSUME(nebulara_tokens_1.StringLiteral);
        });
        this.printStatement = this.RULE('printStatement', () => {
            this.CONSUME(nebulara_tokens_1.PRINT);
            this.SUBRULE(this.expression);
        });
        this.returnStatement = this.RULE('returnStatement', () => {
            this.CONSUME(nebulara_tokens_1.RETURN);
            this.OPTION(() => this.SUBRULE(this.expression));
        });
        this.storeStatement = this.RULE('storeStatement', () => {
            this.CONSUME(nebulara_tokens_1.STORE);
            this.CONSUME(nebulara_tokens_1.StringLiteral);
            this.CONSUME(nebulara_tokens_1.IN);
            this.CONSUME(nebulara_tokens_1.DEVICE);
            this.OPTION(() => {
                this.CONSUME(nebulara_tokens_1.UNTIL);
                this.CONSUME2(nebulara_tokens_1.StringLiteral);
            });
        });
        // ====================================================================
        // EXPRESSIONS
        // ====================================================================
        this.expressionStatement = this.RULE('expressionStatement', () => {
            this.SUBRULE(this.expression);
        });
        this.expression = this.RULE('expression', () => {
            this.SUBRULE(this.logicalExpression);
        });
        this.logicalExpression = this.RULE('logicalExpression', () => {
            this.SUBRULE(this.comparisonExpression);
            this.MANY(() => {
                this.OR([
                    { ALT: () => this.CONSUME(nebulara_tokens_1.AND) },
                    { ALT: () => this.CONSUME(nebulara_tokens_1.OR) }
                ]);
                this.SUBRULE2(this.comparisonExpression);
            });
        });
        this.comparisonExpression = this.RULE('comparisonExpression', () => {
            this.SUBRULE(this.additiveExpression);
            this.MANY(() => {
                this.OR([
                    { ALT: () => this.CONSUME(nebulara_tokens_1.Equals) },
                    { ALT: () => this.CONSUME(nebulara_tokens_1.NotEquals) },
                    { ALT: () => this.CONSUME(nebulara_tokens_1.GreaterThan) },
                    { ALT: () => this.CONSUME(nebulara_tokens_1.LessThan) },
                    { ALT: () => this.CONSUME(nebulara_tokens_1.GreaterEqual) },
                    { ALT: () => this.CONSUME(nebulara_tokens_1.LessEqual) }
                ]);
                this.SUBRULE2(this.additiveExpression);
            });
        });
        this.additiveExpression = this.RULE('additiveExpression', () => {
            this.SUBRULE(this.multiplicativeExpression);
            this.MANY(() => {
                this.OR([
                    { ALT: () => this.CONSUME(nebulara_tokens_1.Plus) },
                    { ALT: () => this.CONSUME(nebulara_tokens_1.Minus) }
                ]);
                this.SUBRULE2(this.multiplicativeExpression);
            });
        });
        this.multiplicativeExpression = this.RULE('multiplicativeExpression', () => {
            this.SUBRULE(this.unaryExpression);
            this.MANY(() => {
                this.OR([
                    { ALT: () => this.CONSUME(nebulara_tokens_1.Multiply) },
                    { ALT: () => this.CONSUME(nebulara_tokens_1.Divide) }
                ]);
                this.SUBRULE2(this.unaryExpression);
            });
        });
        this.unaryExpression = this.RULE('unaryExpression', () => {
            this.OR([
                {
                    ALT: () => {
                        this.CONSUME(nebulara_tokens_1.NOT);
                        this.SUBRULE(this.unaryExpression);
                    }
                },
                { ALT: () => this.SUBRULE(this.primaryExpression) }
            ]);
        });
        this.primaryExpression = this.RULE('primaryExpression', () => {
            this.OR([
                { ALT: () => this.CONSUME(nebulara_tokens_1.NumberLiteral) },
                { ALT: () => this.CONSUME(nebulara_tokens_1.StringLiteral) },
                { ALT: () => this.CONSUME(nebulara_tokens_1.BooleanLiteral) },
                { ALT: () => this.SUBRULE(this.identifierExpression) },
                { ALT: () => this.SUBRULE(this.arrayLiteral) },
                { ALT: () => this.SUBRULE(this.objectLiteral) },
                {
                    ALT: () => {
                        this.CONSUME(nebulara_tokens_1.LParen);
                        this.SUBRULE(this.expression);
                        this.CONSUME(nebulara_tokens_1.RParen);
                    }
                }
            ]);
        });
        this.identifierExpression = this.RULE('identifierExpression', () => {
            this.CONSUME(nebulara_tokens_1.Identifier);
            this.MANY(() => {
                this.OR([
                    {
                        ALT: () => {
                            this.CONSUME(nebulara_tokens_1.Dot);
                            this.CONSUME2(nebulara_tokens_1.Identifier);
                        }
                    },
                    {
                        ALT: () => {
                            this.CONSUME(nebulara_tokens_1.LBracket);
                            this.SUBRULE(this.expression);
                            this.CONSUME(nebulara_tokens_1.RBracket);
                        }
                    },
                    { ALT: () => this.SUBRULE(this.functionCall) }
                ]);
            });
        });
        this.functionCall = this.RULE('functionCall', () => {
            this.OPTION(() => this.CONSUME(nebulara_tokens_1.LParen));
            this.OPTION2(() => this.SUBRULE(this.argumentList));
            this.OPTION3(() => this.CONSUME(nebulara_tokens_1.RParen));
        });
        // ====================================================================
        // HELPERS
        // ====================================================================
        this.assignment = this.RULE('assignment', () => {
            this.CONSUME(nebulara_tokens_1.Identifier);
            this.CONSUME(nebulara_tokens_1.Assign);
            this.SUBRULE(this.expression);
        });
        this.parameterList = this.RULE('parameterList', () => {
            this.OPTION(() => this.CONSUME(nebulara_tokens_1.LParen));
            this.OPTION2(() => {
                this.CONSUME(nebulara_tokens_1.Identifier);
                this.MANY(() => {
                    this.OPTION3(() => this.CONSUME(nebulara_tokens_1.Comma));
                    this.CONSUME2(nebulara_tokens_1.Identifier);
                });
            });
            this.OPTION4(() => this.CONSUME(nebulara_tokens_1.RParen));
        });
        this.argumentList = this.RULE('argumentList', () => {
            this.SUBRULE(this.expression);
            this.MANY(() => {
                this.OPTION(() => this.CONSUME(nebulara_tokens_1.Comma));
                this.SUBRULE2(this.expression);
            });
        });
        this.arrayLiteral = this.RULE('arrayLiteral', () => {
            this.CONSUME(nebulara_tokens_1.LBracket);
            this.OPTION(() => {
                this.SUBRULE(this.expression);
                this.MANY(() => {
                    this.OPTION2(() => this.CONSUME(nebulara_tokens_1.Comma));
                    this.SUBRULE2(this.expression);
                });
            });
            this.CONSUME(nebulara_tokens_1.RBracket);
        });
        this.objectLiteral = this.RULE('objectLiteral', () => {
            this.CONSUME(nebulara_tokens_1.LBrace);
            this.OPTION(() => {
                this.SUBRULE(this.objectProperty);
                this.MANY(() => {
                    this.OPTION2(() => this.CONSUME(nebulara_tokens_1.Comma));
                    this.SUBRULE2(this.objectProperty);
                });
            });
            this.CONSUME(nebulara_tokens_1.RBrace);
        });
        this.objectProperty = this.RULE('objectProperty', () => {
            this.OR([
                { ALT: () => this.CONSUME(nebulara_tokens_1.Identifier) },
                { ALT: () => this.CONSUME(nebulara_tokens_1.StringLiteral) }
            ]);
            this.OPTION(() => this.CONSUME(nebulara_tokens_1.Colon));
            this.SUBRULE(this.expression);
        });
        this.performSelfAnalysis();
    }
}
exports.NebularaParser = NebularaParser;
// Create parser instance
exports.nebularaParser = new NebularaParser();
//# sourceMappingURL=nebulara-parser.js.map