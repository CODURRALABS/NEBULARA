#!/usr/bin/env node
'use strict';

/**
 * Seed the Nebulara registry with the standard library packages.
 * Run: node scripts/seed-registry.js
 */

const path = require('path');
const registry = require('../registry/index');

const stdDir = path.join(__dirname, '..', 'std');

const packages = [
    { name: 'primitives', file: 'primitives.nbs', desc: 'Type checking and casting utilities' },
    { name: 'string', file: 'string.nbs', desc: 'String manipulation functions' },
    { name: 'math', file: 'math.nbs', desc: 'Basic math operations' },
    { name: 'math-ext', file: 'math_ext.nbs', desc: 'Extended math library (trig, stats, linear algebra)' },
    { name: 'collections', file: 'collections.nbs', desc: 'Array/collection utilities' },
    { name: 'sort', file: 'sort.nbs', desc: 'Sorting algorithms and binary search' },
    { name: 'map', file: 'map.nbs', desc: 'Key-value dictionary data structure' },
    { name: 'set', file: 'set.nbs', desc: 'Set data structure (union, intersection, diff)' },
    { name: 'json', file: 'json.nbs', desc: 'JSON parser and stringifier' },
    { name: 'net', file: 'net.nbs', desc: 'HTTP client via FFI/curl' },
    { name: 'time', file: 'time.nbs', desc: 'Time and sleep utilities' },
    { name: 'os', file: 'os.nbs', desc: 'OS utilities (exec, env, platform detection)' },
    { name: 'rand', file: 'rand.nbs', desc: 'Random number generation and shuffling' },
    { name: 'fmt', file: 'fmt.nbs', desc: 'String formatting and padding' },
    { name: 'args', file: 'args.nbs', desc: 'Command line argument parsing' },
    { name: 'test', file: 'test.nbs', desc: 'Unit testing framework' },
    { name: 'kanban', file: 'kanban.nbs', desc: 'Kanban board data structure' },
];

console.log('Seeding Nebulara registry with', packages.length, 'packages...\n');

for (const pkg of packages) {
    const filePath = path.join(stdDir, pkg.file);
    try {
        const result = registry.publish(pkg.name, '1.0.0', filePath, {
            description: pkg.desc,
            author: 'CODURRALABS',
            tags: ['stdlib', 'official'],
        });
        console.log(`  OK: ${pkg.name}@1.0.0 (hash: ${result.hash.substring(0, 12)}...)`);
    } catch (e) {
        console.log(`  SKIP: ${pkg.name} (${e.message})`);
    }
}

console.log('\nRegistry seeded! Listing all packages:');
const all = registry.list();
for (const p of all) {
    console.log(`  ${p.name} - ${p.description} (${p.versions} version(s))`);
}
