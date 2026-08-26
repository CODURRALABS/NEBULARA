#!/usr/bin/env node
'use strict';

const path = require('path');
const fs = require('fs');
const {
    initProject,
    installProject,
    installPackage,
    publishPackage,
    searchPackages,
    listInstalled,
} = require('./lib/package-manager');

const args = process.argv.slice(2);
const command = args[0];

function usage() {
    console.log(`
Nebulara Package Manager (neb pkg)

Usage:
  neb pkg init [name]              Initialize a new project
  neb pkg install [package@ver]    Install dependencies or a specific package
  neb pkg publish <file.nbpkg>     Publish a package
  neb pkg search <query>           Search packages
  neb pkg list                     List installed packages
  neb pkg help                     Show this help

Examples:
  neb pkg init my-app
  neb pkg install std/math.nbs
  neb pkg install npm/lodash@4.17.21
  neb pkg search json
  neb pkg publish my-lib-1.0.0.nbpkg
`);
}

async function main() {
    const cwd = process.cwd();

    switch (command) {
        case 'init': {
            const name = args[1] || 'my-project';
            initProject(cwd, name);
            break;
        }

        case 'install':
        case 'add': {
            if (args[1]) {
                await installPackage(cwd, args[1]);
            } else {
                await installProject(cwd);
            }
            break;
        }

        case 'publish': {
            const file = args[1];
            if (!file) {
                console.error('Error: Provide a package file to publish');
                process.exit(1);
            }
            const filePath = path.resolve(cwd, file);
            await publishPackage(cwd, { file: filePath });
            break;
        }

        case 'search':
        case 'find': {
            const query = args[1];
            if (!query) {
                console.error('Error: Provide a search query');
                process.exit(1);
            }
            const results = await searchPackages(query);
            if (results.length === 0) {
                console.log('No packages found.');
            } else {
                console.log(`Found ${results.length} packages:`);
                for (const r of results) {
                    console.log(`  ${r.name}@${r.version} - ${r.description || ''}`);
                }
            }
            break;
        }

        case 'list':
        case 'ls': {
            listInstalled(cwd);
            break;
        }

        case 'help':
        case '--help':
        case '-h':
        case undefined:
            usage();
            break;

        default:
            console.error(`Unknown command: ${command}`);
            usage();
            process.exit(1);
    }
}

main().catch(err => {
    console.error(`Error: ${err.message}`);
    process.exit(1);
});
