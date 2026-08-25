'use strict';

const fs = require('fs');
const path = require('path');
const { getRegistry } = require('./registries/index');

const LOCKFILE = 'neb.lock';
const MANIFEST = 'neb.json';
const PACKAGES_DIR = 'packages';

function readManifest(projectDir) {
    const manifestPath = path.join(projectDir, MANIFEST);
    if (!fs.existsSync(manifestPath)) return { name: 'untitled', version: '0.1.0', dependencies: {} };
    return JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
}

function writeManifest(projectDir, manifest) {
    fs.writeFileSync(path.join(projectDir, MANIFEST), JSON.stringify(manifest, null, 2) + '\n');
}

function readLockfile(projectDir) {
    const lockPath = path.join(projectDir, LOCKFILE);
    if (!fs.existsSync(lockPath)) return {};
    return JSON.parse(fs.readFileSync(lockPath, 'utf8'));
}

function writeLockfile(projectDir, lock) {
    fs.writeFileSync(path.join(projectDir, LOCKFILE), JSON.stringify(lock, null, 2) + '\n');
}

function ensureDir(dir) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function parseDepSpec(spec) {
    const atIdx = spec.lastIndexOf('@');
    if (atIdx > 0) {
        const registry = spec.substring(0, atIdx);
        const pkg = spec.substring(atIdx + 1);
        const slashIdx = pkg.indexOf('/');
        if (slashIdx > 0) {
            return { registry, name: pkg.substring(0, slashIdx), versionSpec: pkg.substring(slashIdx + 1) };
        }
        return { registry, name: pkg, versionSpec: '' };
    }
    return { registry: 'nebulara', name: spec, versionSpec: '' };
}

function resolveDepId(registry, name, version) {
    return `${registry}/${name}@${version}`;
}

async function resolveDependencyTree(deps, resolved = new Map(), resolving = new Set()) {
    for (const [name, spec] of Object.entries(deps)) {
        if (resolving.has(name)) continue;
        resolving.add(name);

        let registry, versionSpec;
        if (typeof spec === 'string') {
            ({ registry, name: depName, versionSpec } = parseDepSpec(name));
            if (depName) name = depName;
        } else {
            registry = spec.registry || 'nebulara';
            versionSpec = spec.version || '';
        }

        const reg = getRegistry(registry);
        if (!reg) throw new Error(`Unknown registry: ${registry}`);

        const version = await reg.resolveVersion(name, versionSpec);
        if (!version) throw new Error(`Could not resolve ${name} from ${registry}`);

        const depId = resolveDepId(registry, name, version);
        if (resolved.has(depId)) continue;

        console.log(`  Resolved ${registry}/${name}@${version}`);

        let subDeps = {};
        if (registry === 'npm') {
            try {
                const { getJSON } = require('./http');
                const data = await getJSON(`https://registry.npmjs.org/${name}/${version}`);
                subDeps = data.dependencies || {};
            } catch {}
        }

        await resolveDependencyTree(subDeps, resolved, resolving);
        resolved.set(depId, { registry, name, version, dependencies: subDeps });
    }
    return resolved;
}

async function installProject(projectDir) {
    const manifest = readManifest(projectDir);
    if (!manifest.dependencies || !Object.keys(manifest.dependencies).length) {
        console.log('No dependencies to install.');
        return;
    }

    console.log('Resolving dependencies...');
    const resolved = await resolveDependencyTree(manifest.dependencies);

    const pkgDir = path.join(projectDir, PACKAGES_DIR);
    ensureDir(pkgDir);

    const lock = {};
    for (const [depId, info] of resolved) {
        const reg = getRegistry(info.registry);
        if (!reg || !reg.download) continue;

        console.log(`  Downloading ${depId}...`);
        try {
            const { url, name: fileName } = await reg.download(info.name, info.version);
            if (!url) { console.log(`    SKIP ${depId} (no download URL)`); continue; }

            const destDir = path.join(pkgDir, `${info.registry}__${info.name}`);
            ensureDir(destDir);
            const destFile = path.join(destDir, fileName);

            const { fetch } = require('./http');
            const response = await fetch(url);
            fs.writeFileSync(destFile, response.body);

            if (fileName.endsWith('.tgz') || fileName.endsWith('.tar.gz')) {
                try {
                    const { execSync } = require('child_process');
                    execSync(`tar -xzf "${destFile}" -C "${destDir}"`, { stdio: 'ignore' });
                } catch {}
            }

            lock[depId] = { registry: info.registry, name: info.name, version: info.version, file: fileName };
            console.log(`    OK: ${depId}`);
        } catch (e) {
            console.log(`    FAILED: ${depId} (${e.message})`);
        }
    }

    writeLockfile(projectDir, lock);
    console.log(`\nInstalled ${Object.keys(lock).length} packages. Lockfile written to ${LOCKFILE}.`);
}

async function installPackage(projectDir, spec) {
    const manifest = readManifest(projectDir);
    const parsed = parseDepSpec(spec);
    const name = parsed.name;
    const registry = parsed.registry;

    manifest.dependencies = manifest.dependencies || {};
    manifest.dependencies[name] = {
        registry,
        version: parsed.versionSpec || 'latest',
    };

    writeManifest(projectDir, manifest);
    console.log(`Added ${registry}/${name} to dependencies.`);
    await installProject(projectDir);
}

async function publishPackage(projectDir, opts = {}) {
    const manifest = readManifest(projectDir);
    const pkgName = opts.name || manifest.name;
    const version = opts.version || manifest.version;
    const registry = opts.registry || 'nebulara';

    const reg = getRegistry(registry);
    if (!reg || !reg.publish) throw new Error(`Registry ${registry} does not support publish`);

    const filePath = opts.file;
    if (!filePath || !fs.existsSync(filePath)) throw new Error(`Package file not found: ${filePath}`);

    const description = manifest.description || '';
    console.log(`Publishing ${pkgName}@${version} to ${registry}...`);
    const result = await reg.publish(pkgName, version, filePath, { description });
    console.log(`Published successfully: ${result.url}`);
    return result;
}

async function searchPackages(query, registries) {
    const registryList = registries || ['nebulara', 'npm'];
    const results = [];

    for (const regName of registryList) {
        const reg = getRegistry(regName);
        if (!reg) continue;
        try {
            const items = await reg.search(query);
            results.push(...items);
        } catch {}
    }

    return results;
}

async function initProject(projectDir, name) {
    const manifest = {
        name: name || 'my-project',
        version: '0.1.0',
        description: '',
        main: 'main.nbs',
        dependencies: {},
        nebulara: { version: '>=1.2.0' },
    };
    writeManifest(projectDir, manifest);
    console.log(`Initialized project "${manifest.name}" in ${MANIFEST}`);

    const mainFile = path.join(projectDir, 'main.nbs');
    if (!fs.existsSync(mainFile)) {
        fs.writeFileSync(mainFile, 'PRINT("Hello from Nebulara!")\n');
        console.log(`Created ${mainFile}`);
    }
}

function listInstalled(projectDir) {
    const lock = readLockfile(projectDir);
    if (!Object.keys(lock).length) {
        console.log('No packages installed.');
        return [];
    }
    console.log('Installed packages:');
    for (const [depId, info] of Object.entries(lock)) {
        console.log(`  ${depId} (${info.registry})`);
    }
    return Object.values(lock);
}

module.exports = {
    readManifest,
    writeManifest,
    readLockfile,
    writeLockfile,
    parseDepSpec,
    installProject,
    installPackage,
    publishPackage,
    searchPackages,
    initProject,
    listInstalled,
    MANIFEST,
    LOCKFILE,
};
