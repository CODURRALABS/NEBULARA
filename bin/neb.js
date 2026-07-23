#!/usr/bin/env node
'use strict';

const { execFileSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const args = process.argv.slice(2);
const subcommand = args[0];
const pkgRoot = path.resolve(__dirname, '..');
const isWin = process.platform === 'win32';
const exeName = isWin ? 'nebulara.exe' : 'nebulara';

function findBinary() {
    const candidates = [
        path.join(pkgRoot, 'build', exeName),
        path.join(pkgRoot, exeName),
    ];
    for (const p of candidates) {
        if (fs.existsSync(p)) return p;
    }
    return null;
}

function runNative(fileArgs) {
    const bin = findBinary();
    if (!bin) {
        console.error('Error: Nebulara binary not found. Run "npm run build" first.');
        process.exit(1);
    }
    try {
        execFileSync(bin, fileArgs, { stdio: 'inherit' });
    } catch (err) {
        if (err.status !== undefined) process.exit(err.status);
        process.exit(1);
    }
}

const HELP = `
Nebulara CLI - AI-native universal programming language

Usage: neb <command> [options]

Interpreter:
  neb run <file.nbs>          Run a Nebulara source file
  neb check <file.nbs>        Semantic-check a file without running
  neb transpile <file>        Transpile to JS or Python (use --target)
  neb ast <file.nbs>          Show AST for a file

Package Management:
  neb init                    Initialize a new project (creates neb.json)
  neb install [pkg]           Install a dependency (or all from neb.json)
  neb uninstall <pkg>         Remove a dependency
  neb publish <file.nbpkg>    Publish a package to a registry
  neb search <query>          Search packages across registries
  neb list                    List installed packages

Multi-Registry (npm, pip, crates.io, go, maven):
  neb install npm/<pkg>       Install from npm
  neb install pip/<pkg>       Install from pip (Python)
  neb install crates.io/<pkg> Install from crates.io (Rust)
  neb search --registry npm <q>  Search npm only

Compiler Tools:
  neb build <file.nbs>        Build to native executable
  neb transpile --target js   Transpile to JavaScript
  neb transpile --target py   Transpile to Python

Other:
  neb help                    Show this help
  neb version                 Show version
  neb repl                    Start interactive REPL (uses native binary)
  neb knowledge               Knowledge graph tool (uses native binary)
  neb ffi <lib> <sym>         Test FFI binding (uses native binary)

Environment:
  NEB_REGISTRY_OWNER          GitHub org for package registry (default: CODURRALABS)
  NEB_REGISTRY_REPO           GitHub repo for packages (default: NEBULARA-PACKAGES)
  NEB_REGISTRY_TOKEN          GitHub token for publish
  GITHUB_TOKEN                Fallback GitHub token
  NPM_REGISTRY                Custom npm registry URL
`;

function getVersion() {
    try {
        const pkg = JSON.parse(fs.readFileSync(path.join(pkgRoot, 'package.json'), 'utf8'));
        return pkg.version;
    } catch {
        return 'unknown';
    }
}

async function main() {
    if (!subcommand || subcommand === 'help' || subcommand === '--help' || subcommand === '-h') {
        console.log(HELP);
        return;
    }

    if (subcommand === 'version' || subcommand === '--version') {
        console.log(`nebulara ${getVersion()}`);
        return;
    }

    if (subcommand === 'run') {
        const file = args[1];
        if (!file) { console.error('Usage: neb run <file.nbs>'); process.exit(1); }
        runNative([file]);
        return;
    }

    if (subcommand === 'check') {
        const file = args[1];
        if (!file) { console.error('Usage: neb check <file.nbs>'); process.exit(1); }
        runNative(['--check', file]);
        return;
    }

    if (subcommand === 'repl') {
        runNative([]);
        return;
    }

    if (subcommand === 'ast') {
        const file = args[1];
        if (!file) { console.error('Usage: neb ast <file.nbs>'); process.exit(1); }
        runNative(['--ast', file]);
        return;
    }

    if (subcommand === 'build') {
        const file = args[1];
        if (!file) { console.error('Usage: neb build <file.nbs>'); process.exit(1); }
        runNative(['--native', file]);
        return;
    }

    if (subcommand === 'transpile') {
        const targetIdx = args.indexOf('--target');
        const target = targetIdx >= 0 ? args[targetIdx + 1] : 'js';
        const file = args.find((a, i) => i > 1 && !a.startsWith('--'));
        if (!file) { console.error('Usage: neb transpile <file> --target js|py'); process.exit(1); }
        runNative(['--target', target, file]);
        return;
    }

    if (subcommand === 'knowledge') {
        runNative(['--knowledge']);
        return;
    }

    if (subcommand === 'ffi') {
        runNative(['--ffi', ...args.slice(1)]);
        return;
    }

    if (subcommand === 'init') {
        const pm = require('../lib/package-manager');
        const name = args[1] || path.basename(process.cwd());
        await pm.initProject(process.cwd(), name);
        return;
    }

    if (subcommand === 'install' || subcommand === 'i' || subcommand === 'add') {
        const pm = require('../lib/package-manager');
        const spec = args[1];
        if (spec) {
            await pm.installPackage(process.cwd(), spec);
        } else {
            await pm.installProject(process.cwd());
        }
        return;
    }

    if (subcommand === 'uninstall' || subcommand === 'remove' || subcommand === 'rm') {
        const pm = require('../lib/package-manager');
        const pkgName = args[1];
        if (!pkgName) { console.error('Usage: neb uninstall <package>'); process.exit(1); }
        const manifest = pm.readManifest(process.cwd());
        if (manifest.dependencies) {
            delete manifest.dependencies[pkgName];
            pm.writeManifest(process.cwd(), manifest);
            console.log(`Removed ${pkgName} from dependencies.`);
        }
        return;
    }

    if (subcommand === 'publish') {
        const pm = require('../lib/package-manager');
        const file = args[1];
        if (!file) { console.error('Usage: neb publish <file.nbpkg>'); process.exit(1); }
        const registryIdx = args.indexOf('--registry');
        const registry = registryIdx >= 0 ? args[registryIdx + 1] : 'nebulara';
        await pm.publishPackage(process.cwd(), { file, registry });
        return;
    }

    if (subcommand === 'search' || subcommand === 's') {
        const pm = require('../lib/package-manager');
        const query = args.slice(1).filter((a) => !a.startsWith('--')).join(' ');
        if (!query) { console.error('Usage: neb search <query>'); process.exit(1); }
        const registryIdx = args.indexOf('--registry');
        const registries = registryIdx >= 0 ? [args[registryIdx + 1]] : undefined;
        const results = await pm.searchPackages(query, registries);
        if (!results.length) { console.log('No packages found.'); return; }
        for (const r of results) {
            console.log(`  ${r.registry}/${r.name} v${r.version} - ${r.description}`);
        }
        return;
    }

    if (subcommand === 'list' || subcommand === 'ls') {
        const pm = require('../lib/package-manager');
        pm.listInstalled(process.cwd());
        return;
    }

    console.error(`Unknown command: ${subcommand}. Run "neb help" for usage.`);
    process.exit(1);
}

main().catch((e) => {
    console.error(e.message);
    process.exit(1);
});
