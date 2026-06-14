"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NebularaTranspiler = void 0;
const nebulara_parser_1 = require("../parser/nebulara-parser");
const nebulara_tokens_1 = require("../lexer/nebulara-tokens");
class NebularaTranspiler {
    constructor(options) {
        this.parser = nebulara_parser_1.nebularaParser;
        this.indentLevel = 0;
        this.output = [];
        this.options = options;
    }
    transpile(code) {
        try {
            this.output = [];
            this.indentLevel = 0;
            const lexResult = nebulara_tokens_1.NebularaLexer.tokenize(code);
            if (lexResult.errors.length > 0) {
                throw new Error(`Lexer errors: ${lexResult.errors.map((e) => e.message).join(', ')}`);
            }
            this.parser.input = lexResult.tokens;
            const cst = this.parser.program();
            if (this.parser.errors.length > 0) {
                throw new Error(`Parser errors: ${this.parser.errors.map((e) => e.message).join(', ')}`);
            }
            return this.visitProgram(cst);
        }
        catch (error) {
            throw new Error(`Transpilation error: ${error}`);
        }
    }
    visitProgram(node) {
        this.addHeader();
        if (node.children.statement) {
            for (const stmt of node.children.statement) {
                const transpiled = this.visitStatement(stmt);
                if (transpiled.trim()) {
                    this.addLine(transpiled);
                }
            }
        }
        this.addFooter();
        return this.output.join('\n');
    }
    visitStatement(node) {
        if (node.children.appDeclaration)
            return this.visitAppDeclaration(node.children.appDeclaration[0]);
        if (node.children.aiDeclaration)
            return this.visitAiDeclaration(node.children.aiDeclaration[0]);
        if (node.children.dataDeclaration)
            return this.visitDataDeclaration(node.children.dataDeclaration[0]);
        if (node.children.runBlock)
            return this.visitRunBlock(node.children.runBlock[0]);
        if (node.children.funcDeclaration)
            return this.visitFuncDeclaration(node.children.funcDeclaration[0]);
        if (node.children.classDeclaration)
            return this.visitClassDeclaration(node.children.classDeclaration[0]);
        if (node.children.componentDeclaration)
            return this.visitComponentDeclaration(node.children.componentDeclaration[0]);
        if (node.children.modelDeclaration)
            return this.visitModelDeclaration(node.children.modelDeclaration[0]);
        if (node.children.sceneDeclaration)
            return this.visitSceneDeclaration(node.children.sceneDeclaration[0]);
        if (node.children.printStatement)
            return this.visitPrintStatement(node.children.printStatement[0]);
        if (node.children.returnStatement)
            return this.visitReturnStatement(node.children.returnStatement[0]);
        if (node.children.expressionStatement)
            return this.visitExpressionStatement(node.children.expressionStatement[0]);
        return '';
    }
    // ====================================================================
    // NEBULARA IDENTITY DECLARATIONS
    // ====================================================================
    visitAppDeclaration(node) {
        const appName = this.extractStringLiteral(node.children.StringLiteral[0]);
        switch (this.options.target) {
            case 'javascript':
                if (this.options.framework === 'react')
                    return this.generateReactApp(appName, node);
                if (this.options.framework === 'node')
                    return this.generateNodeApp(appName, node);
                return this.generateVanillaJSApp(appName, node);
            case 'python':
                if (this.options.framework === 'django')
                    return this.generateDjangoApp(appName, node);
                if (this.options.framework === 'flask')
                    return this.generateFlaskApp(appName, node);
                return this.generatePythonApp(appName, node);
            case 'cpp': return this.generateCppApp(appName, node);
            case 'csharp':
                if (this.options.framework === 'unity')
                    return this.generateUnityApp(appName, node);
                return this.generateCSharpApp(appName, node);
            case 'rust': return this.generateRustApp(appName, node);
            case 'html': return this.generateHTMLApp(appName, node);
            default: return `// App: ${appName}`;
        }
    }
    visitAiDeclaration(node) {
        const aiName = this.extractStringLiteral(node.children.StringLiteral[0]);
        switch (this.options.target) {
            case 'python':
                return `class ${aiName}AI:\n    def __init__(self):\n        self.name = "${aiName}"\n        self.capabilities = []\n    \ndef process(self, input_data):\n        # AI processing logic\n        return f"Processed by {self.name}: {input_data}"`;
            case 'javascript':
                return `class ${aiName}AI {\n    constructor() {\n        this.name = "${aiName}";\n        this.capabilities = [];\n    }\n    \n    process(inputData) {\n        // AI processing logic\n        return \`Processed by \${this.name}: \${inputData}\`;\n    }\n}`;
            default:
                return `// AI Agent: ${aiName}`;
        }
    }
    visitDataDeclaration(node) {
        const dataName = this.extractIdentifier(node.children.Identifier[0]);
        switch (this.options.target) {
            case 'javascript': return `const ${dataName} = {};`;
            case 'python': return `${dataName} = {}`;
            case 'cpp': return `std::map<std::string, std::any> ${dataName};`;
            case 'csharp': return `Dictionary<string, object> ${dataName} = new Dictionary<string, object>();`;
            default: return `// Data: ${dataName}`;
        }
    }
    visitRunBlock(node) {
        const statements = this.extractStatements(node);
        switch (this.options.target) {
            case 'javascript': return `(function main() {\n${statements}\n})();`;
            case 'python': return `if __name__ == "__main__":\n${this.indent(statements)}`;
            case 'cpp': return `int main() {\n${this.indent(statements)}\n    return 0;\n}`;
            case 'csharp': return `static void Main(string[] args) {\n${this.indent(statements)}\n}`;
            default: return statements;
        }
    }
    visitFuncDeclaration(node) {
        const funcName = this.extractStringLiteral(node.children.StringLiteral[0]);
        const params = this.extractParameters(node);
        const body = this.extractStatements(node);
        switch (this.options.target) {
            case 'javascript': return `function ${funcName}(${params.join(', ')}) {\n${this.indent(body)}\n}`;
            case 'python': return `def ${funcName}(${params.join(', ')}):\n${this.indent(body)}`;
            default: return `// Function: ${funcName}`;
        }
    }
    visitClassDeclaration(node) {
        const name = this.extractIdentifier(node.children.Identifier[0]);
        switch (this.options.target) {
            case 'javascript': return `class ${name} { constructor() {} }`;
            case 'python': return `class ${name}:\n    def __init__(self): pass`;
            default: return `class ${name} {}`;
        }
    }
    visitComponentDeclaration(node) { return '// Component'; }
    visitModelDeclaration(node) { return '// Model'; }
    visitSceneDeclaration(node) { return '// Scene'; }
    visitPrintStatement(node) { return '// print'; }
    visitReturnStatement(node) { return '// return'; }
    visitExpressionStatement(node) {
        const expr = this.visitExpression(node.children.expression[0]);
        return expr + (['javascript', 'cpp', 'csharp'].includes(this.options.target) ? ';' : '');
    }
    visitExpression(node) { return 'expression'; }
    // ====================================================================
    // FRAMEWORK-SPECIFIC GENERATORS
    // ====================================================================
    generateReactApp(appName, node) {
        return `import React from 'react';\n\nfunction ${appName}() {\n  return (\n    <div className="${appName.toLowerCase()}">\n      <h1>${appName}</h1>\n    </div>\n  );\n}\n\nexport default ${appName};`;
    }
    generateNodeApp(appName, node) {
        return `const express = require('express');\nconst app = express();\nconst PORT = process.env.PORT || 3000;\n\napp.get('/', (req, res) => {\n  res.json({ app: '${appName}', message: 'Generated by Nebulara' });\n});\n\napp.listen(PORT, () => {\n  console.log(\`${appName} server running port \${PORT}\`);\n});`;
    }
    generatePythonApp(appName, node) {
        return `class ${appName}:\n    def __init__(self):\n        self.name = "${appName}"\n    def run(self):\n        print(f"Running {self.name}")\n\nif __name__ == "__main__":\n    ${appName}().run()`;
    }
    generateDjangoApp(appName, node) {
        return `from django.http import JsonResponse\nfrom django.views import View\n\nclass ${appName}View(View):\n    def get(self, request):\n        return JsonResponse({ 'app': '${appName}', 'message': 'Generated by Nebulara' })`;
    }
    generateFlaskApp(appName, node) {
        return `from flask import Flask, jsonify\napp = Flask(__name__)\n\n@app.route('/')\ndef ${appName.toLowerCase()}():\n    return jsonify({ 'app': '${appName}', 'message': 'Generated by Nebulara' })\n\nif __name__ == '__main__':\n    app.run(debug=True)`;
    }
    generateCppApp(appName, node) {
        return `#include <iostream>\n\nclass ${appName} {\npublic:\n    void run() { std::cout << "Running ${appName}" << std::endl; }\n};\n\nint main() { ${appName} app; app.run(); return 0; }`;
    }
    generateCSharpApp(appName, node) {
        return `using System;\n\nnamespace ${appName} {\n    class Program {\n        static void Main(string[] args) { Console.WriteLine("Running ${appName}"); }\n    }\n}`;
    }
    generateUnityApp(appName, node) {
        return `using UnityEngine;\n\npublic class ${appName} : MonoBehaviour {\n    void Start() { Debug.Log("${appName} initialized"); }\n}`;
    }
    generateRustApp(appName, node) {
        return `fn main() { println!("Running ${appName}"); }`;
    }
    generateHTMLApp(appName, node) {
        return `<!DOCTYPE html><html><head><title>${appName}</title></head><body><h1>${appName}</h1></body></html>`;
    }
    generateVanillaJSApp(appName, node) {
        return `class ${appName} {\n    constructor() {\n        console.log("${appName} initialized");\n    }\n}`;
    }
    // ====================================================================
    // UTILITY METHODS
    // ====================================================================
    addHeader() {
        const headers = {
            javascript: '// Generated by Nebulara Transpiler\n',
            python: '# Generated by Nebulara Transpiler\n',
            cpp: '// Generated by Nebulara Transpiler\n',
            csharp: '// Generated by Nebulara Transpiler\n',
            rust: '// Generated by Nebulara Transpiler\n',
            html: '<!-- Generated by Nebulara Transpiler -->\n',
            css: '/* Generated by Nebulara Transpiler */\n'
        };
        const header = headers[this.options.target];
        if (header)
            this.output.push(header);
    }
    addFooter() { }
    addLine(line) {
        this.output.push(line);
    }
    indent(text) {
        const spaces = '    '.repeat(this.indentLevel + 1);
        return text.split('\n').map(l => l.trim() ? spaces + l : l).join('\n');
    }
    extractStringLiteral(token) {
        return token.image.slice(1, -1);
    }
    extractIdentifier(token) {
        return token.image;
    }
    extractParameters(node) {
        return [];
    }
    extractStatements(node) {
        if (!node.children.statement)
            return '';
        return node.children.statement
            .map((stmt) => this.visitStatement(stmt))
            .filter((s) => s.trim())
            .join('\n');
    }
}
exports.NebularaTranspiler = NebularaTranspiler;
//# sourceMappingURL=transpiler.js.map