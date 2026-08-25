'use strict';

const vscode = require('vscode');
const { execFileSync } = require('child_process');
const path = require('path');
const fs = require('fs');

let extensionTerminal = null;

function activate(context) {
    context.subscriptions.push(
        vscode.commands.registerCommand('nebulara.run', () => runCommand([])),
        vscode.commands.registerCommand('nebulara.check', () => runCommand(['--check'])),
        vscode.commands.registerCommand('nebulara.transpileJS', () => runCommand(['--target', 'js'])),
        vscode.commands.registerCommand('nebulara.transpilePY', () => runCommand(['--target', 'py']))
    );

    context.subscriptions.push(
        vscode.window.onDidCloseTerminal((t) => {
            if (t === extensionTerminal) {
                extensionTerminal = null;
            }
        })
    );

    const diagnosticCollection = vscode.languages.createDiagnosticCollection('nebulara');
    context.subscriptions.push(diagnosticCollection);

    context.subscriptions.push(
        vscode.workspace.onDidSaveTextDocument((doc) => {
            if (doc.languageId === 'nebulara') checkDocument(doc, diagnosticCollection);
        })
    );

    context.subscriptions.push(
        vscode.workspace.onDidOpenTextDocument((doc) => {
            if (doc.languageId === 'nebulara') checkDocument(doc, diagnosticCollection);
        })
    );
}

function findBinary() {
    const exeName = process.platform === 'win32' ? 'nebulara.exe' : 'nebulara';
    const workspaceFolder = vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0
        ? vscode.workspace.workspaceFolders[0].uri.fsPath
        : '';
    const candidates = [
        path.join(workspaceFolder, 'build', exeName),
        path.join(workspaceFolder, exeName),
    ];
    for (const p of candidates) {
        if (fs.existsSync(p)) return p;
    }
    return 'nebulara';
}

function runCommand(args) {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return vscode.window.showErrorMessage('No active editor');
    const bin = findBinary();
    const filePath = editor.document.fileName;
    if (!extensionTerminal) {
        extensionTerminal = vscode.window.createTerminal('Nebulara');
    }
    extensionTerminal.show();
    extensionTerminal.sendText(`"${bin}" ${args.join(' ')} "${filePath}"`);
}

function checkDocument(doc, diagnosticCollection) {
    const bin = findBinary();
    const filePath = doc.fileName;
    try {
        const output = execFileSync(bin, ['--check', filePath], { encoding: 'utf8', timeout: 5000 });
        diagnosticCollection.set(doc.uri, []);
        return { valid: true, output };
    } catch (err) {
        const stderr = err.stderr || '';
        const diagnostics = parseErrors(doc, stderr);
        diagnosticCollection.set(doc.uri, diagnostics);
        return { valid: false, errors: diagnostics };
    }
}

function parseErrors(doc, stderr) {
    const diagnostics = [];
    const lineRegex = /Line (\d+):\s*(.*)/g;
    let match;
    while ((match = lineRegex.exec(stderr)) !== null) {
        const lineNum = parseInt(match[1]) - 1;
        const message = match[2];
        const range = new vscode.Range(lineNum, 0, lineNum, 1000);
        const diagnostic = new vscode.Diagnostic(range, message, vscode.DiagnosticSeverity.Error);
        diagnostics.push(diagnostic);
    }
    return diagnostics;
}

function deactivate() {}

module.exports = { activate, deactivate };
