"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LessThan = exports.GreaterThan = exports.Divide = exports.Multiply = exports.Minus = exports.Plus = exports.Assign = exports.DEVICE = exports.FUNCTIONALITY = exports.ROLE = exports.NOT = exports.OR = exports.AND = exports.UNTIL = exports.IN = exports.STORE = exports.FETCH = exports.RETURN = exports.PRINT = exports.KNOWLEDGECORE = exports.GAMELOGIC = exports.MODELFORGE = exports.ANIMORA = exports.VISUALIA = exports.AUDIOWEAVER = exports.ASSETCRAFTER = exports.DEBUGMATRIX = exports.CODESMITH = exports.TEXTURE = exports.AUDIO = exports.ANIMATION = exports.PHYSICS = exports.SHADER = exports.SCENE = exports.MODEL = exports.COMPONENT = exports.WITH = exports.ELSE = exports.THEN = exports.WHILE = exports.IF = exports.LOOP = exports.END = exports.FUNC = exports.CLASS = exports.LINK = exports.RUN = exports.DATA = exports.AI = exports.APP = void 0;
exports.NebularaLexer = exports.allNebularaTokens = exports.Comment = exports.WhiteSpace = exports.NewLine = exports.Indent = exports.Identifier = exports.BooleanLiteral = exports.NumberLiteral = exports.StringLiteral = exports.RBracket = exports.LBracket = exports.RBrace = exports.LBrace = exports.RParen = exports.LParen = exports.Dot = exports.Colon = exports.Semicolon = exports.Comma = exports.NotEquals = exports.Equals = exports.LessEqual = exports.GreaterEqual = void 0;
const chevrotain_1 = require("chevrotain");
// ====================================================================
// NEBULARA LANGUAGE TOKENS - CODURRA NEBUXIA V2
// Core identifiers for the universal programming language
// ====================================================================
// Core Identity Markers (! syntax)
exports.APP = (0, chevrotain_1.createToken)({ name: 'APP', pattern: /APP!/ });
exports.AI = (0, chevrotain_1.createToken)({ name: 'AI', pattern: /AI!/ });
exports.DATA = (0, chevrotain_1.createToken)({ name: 'DATA', pattern: /DATA!/ });
exports.RUN = (0, chevrotain_1.createToken)({ name: 'RUN', pattern: /RUN!/ });
exports.LINK = (0, chevrotain_1.createToken)({ name: 'LINK', pattern: /LINK!/ });
exports.CLASS = (0, chevrotain_1.createToken)({ name: 'CLASS', pattern: /CLASS!/ });
exports.FUNC = (0, chevrotain_1.createToken)({ name: 'FUNC', pattern: /FUNC!/ });
exports.END = (0, chevrotain_1.createToken)({ name: 'END', pattern: /END!/ });
exports.LOOP = (0, chevrotain_1.createToken)({ name: 'LOOP', pattern: /LOOP!/ });
// Conditional Markers (? syntax)
exports.IF = (0, chevrotain_1.createToken)({ name: 'IF', pattern: /IF\?/ });
exports.WHILE = (0, chevrotain_1.createToken)({ name: 'WHILE', pattern: /WHILE\?/ });
// Block Markers (: syntax)
exports.THEN = (0, chevrotain_1.createToken)({ name: 'THEN', pattern: /THEN:/ });
exports.ELSE = (0, chevrotain_1.createToken)({ name: 'ELSE', pattern: /ELSE:/ });
exports.WITH = (0, chevrotain_1.createToken)({ name: 'WITH', pattern: /WITH/ });
// Extended Identity Tokens for specialized domains
exports.COMPONENT = (0, chevrotain_1.createToken)({ name: 'COMPONENT', pattern: /COMPONENT!/ });
exports.MODEL = (0, chevrotain_1.createToken)({ name: 'MODEL', pattern: /MODEL!/ });
exports.SCENE = (0, chevrotain_1.createToken)({ name: 'SCENE', pattern: /SCENE!/ });
exports.SHADER = (0, chevrotain_1.createToken)({ name: 'SHADER', pattern: /SHADER!/ });
exports.PHYSICS = (0, chevrotain_1.createToken)({ name: 'PHYSICS', pattern: /PHYSICS!/ });
exports.ANIMATION = (0, chevrotain_1.createToken)({ name: 'ANIMATION', pattern: /ANIMATION!/ });
exports.AUDIO = (0, chevrotain_1.createToken)({ name: 'AUDIO', pattern: /AUDIO!/ });
exports.TEXTURE = (0, chevrotain_1.createToken)({ name: 'TEXTURE', pattern: /TEXTURE!/ });
// Aurora AI Agent Identifiers
exports.CODESMITH = (0, chevrotain_1.createToken)({ name: 'CODESMITH', pattern: /CODESMITH!/ });
exports.DEBUGMATRIX = (0, chevrotain_1.createToken)({ name: 'DEBUGMATRIX', pattern: /DEBUGMATRIX!/ });
exports.ASSETCRAFTER = (0, chevrotain_1.createToken)({ name: 'ASSETCRAFTER', pattern: /ASSETCRAFTER!/ });
exports.AUDIOWEAVER = (0, chevrotain_1.createToken)({ name: 'AUDIOWEAVER', pattern: /AUDIOWEAVER!/ });
exports.VISUALIA = (0, chevrotain_1.createToken)({ name: 'VISUALIA', pattern: /VISUALIA!/ });
exports.ANIMORA = (0, chevrotain_1.createToken)({ name: 'ANIMORA', pattern: /ANIMORA!/ });
exports.MODELFORGE = (0, chevrotain_1.createToken)({ name: 'MODELFORGE', pattern: /MODELFORGE!/ });
exports.GAMELOGIC = (0, chevrotain_1.createToken)({ name: 'GAMELOGIC', pattern: /GAMELOGIC!/ });
exports.KNOWLEDGECORE = (0, chevrotain_1.createToken)({ name: 'KNOWLEDGECORE', pattern: /KNOWLEDGECORE!/ });
// Keywords
exports.PRINT = (0, chevrotain_1.createToken)({ name: 'PRINT', pattern: /PRINT/ });
exports.RETURN = (0, chevrotain_1.createToken)({ name: 'RETURN', pattern: /RETURN/ });
exports.FETCH = (0, chevrotain_1.createToken)({ name: 'FETCH', pattern: /FETCH/ });
exports.STORE = (0, chevrotain_1.createToken)({ name: 'STORE', pattern: /STORE/ });
exports.IN = (0, chevrotain_1.createToken)({ name: 'IN', pattern: /IN/ });
exports.UNTIL = (0, chevrotain_1.createToken)({ name: 'UNTIL', pattern: /UNTIL/ });
exports.AND = (0, chevrotain_1.createToken)({ name: 'AND', pattern: /AND/ });
exports.OR = (0, chevrotain_1.createToken)({ name: 'OR', pattern: /OR/ });
exports.NOT = (0, chevrotain_1.createToken)({ name: 'NOT', pattern: /NOT/ });
// Special Keywords
exports.ROLE = (0, chevrotain_1.createToken)({ name: 'ROLE', pattern: /ROLE:/ });
exports.FUNCTIONALITY = (0, chevrotain_1.createToken)({ name: 'FUNCTIONALITY', pattern: /FUNCTIONALITY:/ });
exports.DEVICE = (0, chevrotain_1.createToken)({ name: 'DEVICE', pattern: /DEVICE/ });
// Operators
exports.Assign = (0, chevrotain_1.createToken)({ name: 'Assign', pattern: /=/ });
exports.Plus = (0, chevrotain_1.createToken)({ name: 'Plus', pattern: /\+/ });
exports.Minus = (0, chevrotain_1.createToken)({ name: 'Minus', pattern: /-/ });
exports.Multiply = (0, chevrotain_1.createToken)({ name: 'Multiply', pattern: /\*/ });
exports.Divide = (0, chevrotain_1.createToken)({ name: 'Divide', pattern: /\// });
exports.GreaterThan = (0, chevrotain_1.createToken)({ name: 'GreaterThan', pattern: />/ });
exports.LessThan = (0, chevrotain_1.createToken)({ name: 'LessThan', pattern: /</ });
exports.GreaterEqual = (0, chevrotain_1.createToken)({ name: 'GreaterEqual', pattern: />=/ });
exports.LessEqual = (0, chevrotain_1.createToken)({ name: 'LessEqual', pattern: /<=/ });
exports.Equals = (0, chevrotain_1.createToken)({ name: 'Equals', pattern: /==/ });
exports.NotEquals = (0, chevrotain_1.createToken)({ name: 'NotEquals', pattern: /!=/ });
// Optional Punctuation (for flexibility)
exports.Comma = (0, chevrotain_1.createToken)({ name: 'Comma', pattern: /,/ });
exports.Semicolon = (0, chevrotain_1.createToken)({ name: 'Semicolon', pattern: /;/ });
exports.Colon = (0, chevrotain_1.createToken)({ name: 'Colon', pattern: /:/ });
exports.Dot = (0, chevrotain_1.createToken)({ name: 'Dot', pattern: /\./ });
exports.LParen = (0, chevrotain_1.createToken)({ name: 'LParen', pattern: /\(/ });
exports.RParen = (0, chevrotain_1.createToken)({ name: 'RParen', pattern: /\)/ });
exports.LBrace = (0, chevrotain_1.createToken)({ name: 'LBrace', pattern: /\{/ });
exports.RBrace = (0, chevrotain_1.createToken)({ name: 'RBrace', pattern: /\}/ });
exports.LBracket = (0, chevrotain_1.createToken)({ name: 'LBracket', pattern: /\[/ });
exports.RBracket = (0, chevrotain_1.createToken)({ name: 'RBracket', pattern: /\]/ });
// Literals
exports.StringLiteral = (0, chevrotain_1.createToken)({
    name: 'StringLiteral',
    pattern: /"(?:[^"\\]|\\.)*"/
});
exports.NumberLiteral = (0, chevrotain_1.createToken)({
    name: 'NumberLiteral',
    pattern: /\d+(\.\d+)?/
});
exports.BooleanLiteral = (0, chevrotain_1.createToken)({
    name: 'BooleanLiteral',
    pattern: /true|false/
});
// Identifiers (variable names, function names, etc.)
exports.Identifier = (0, chevrotain_1.createToken)({
    name: 'Identifier',
    pattern: /[a-zA-Z_][a-zA-Z0-9_]*/
});
// Whitespace (significant for indentation-based parsing)
exports.Indent = (0, chevrotain_1.createToken)({
    name: 'Indent',
    pattern: /^[ \t]+/,
    line_breaks: false
});
exports.NewLine = (0, chevrotain_1.createToken)({
    name: 'NewLine',
    pattern: /\r?\n/,
    line_breaks: true
});
exports.WhiteSpace = (0, chevrotain_1.createToken)({
    name: 'WhiteSpace',
    pattern: /[ \t]+/,
    group: chevrotain_1.Lexer.SKIPPED
});
// Comments
exports.Comment = (0, chevrotain_1.createToken)({
    name: 'Comment',
    pattern: /#.*|\/\/.*|\/\*[\s\S]*?\*\//,
    group: chevrotain_1.Lexer.SKIPPED
});
// All tokens in priority order
exports.allNebularaTokens = [
    // Comments and whitespace first
    exports.Comment,
    exports.WhiteSpace,
    // Core identity markers (highest priority)
    exports.APP, exports.AI, exports.DATA, exports.RUN, exports.LINK, exports.CLASS, exports.FUNC, exports.END, exports.LOOP,
    // Conditional markers
    exports.IF, exports.WHILE, exports.THEN, exports.ELSE,
    // Extended identity tokens
    exports.COMPONENT, exports.MODEL, exports.SCENE, exports.SHADER, exports.PHYSICS, exports.ANIMATION, exports.AUDIO, exports.TEXTURE,
    // Aurora AI agents
    exports.CODESMITH, exports.DEBUGMATRIX, exports.ASSETCRAFTER, exports.AUDIOWEAVER, exports.VISUALIA, exports.ANIMORA,
    exports.MODELFORGE, exports.GAMELOGIC, exports.KNOWLEDGECORE,
    // Special keywords
    exports.ROLE, exports.FUNCTIONALITY,
    // Regular keywords
    exports.PRINT, exports.RETURN, exports.FETCH, exports.STORE, exports.IN, exports.UNTIL, exports.AND, exports.OR, exports.NOT, exports.WITH, exports.DEVICE,
    // Operators (longer patterns first)
    exports.GreaterEqual, exports.LessEqual, exports.Equals, exports.NotEquals,
    exports.GreaterThan, exports.LessThan, exports.Assign, exports.Plus, exports.Minus, exports.Multiply, exports.Divide,
    // Punctuation
    exports.Comma, exports.Semicolon, exports.Colon, exports.Dot,
    exports.LParen, exports.RParen, exports.LBrace, exports.RBrace, exports.LBracket, exports.RBracket,
    // Literals
    exports.BooleanLiteral, exports.NumberLiteral, exports.StringLiteral,
    // Identifiers (last)
    exports.Identifier,
    // Line structure
    exports.NewLine, exports.Indent
];
exports.NebularaLexer = new chevrotain_1.Lexer(exports.allNebularaTokens, {
    positionTracking: 'full'
});
//# sourceMappingURL=nebulara-tokens.js.map