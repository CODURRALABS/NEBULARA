'use strict';

const { getJSON, postJSON, uploadReleaseAsset } = require('./http');

class NebularaRegistry {
    constructor() {
        this.name = 'nebulara';
        this.owner = process.env.NEB_REGISTRY_OWNER || 'CODURRALABS';
        this.repo = process.env.NEB_REGISTRY_REPO || 'NEBULARA-PACKAGES';
        this.apiBase = `https://api.github.com/repos/${this.owner}/${this.repo}`;
        this.token = process.env.NEB_REGISTRY_TOKEN || process.env.GITHUB_TOKEN;
    }

    async search(query) {
        const releases = await getJSON(`${this.apiBase}/releases?per_page=100`, this.token);
        return releases
            .filter((r) => r.tag_name.includes(query) || (r.name && r.name.includes(query)))
            .map((r) => ({
                name: r.tag_name,
                description: r.name || '',
                version: r.tag_name.replace(/^v/, ''),
                registry: 'nebulara',
            }));
    }

    async getVersions(name) {
        try {
            const releases = await getJSON(`${this.apiBase}/releases?per_page=100`, this.token);
            return releases
                .filter((r) => r.tag_name.startsWith(name + '@') || r.tag_name === name)
                .map((r) => ({
                    version: r.tag_name.replace(/^v/, ''),
                    assets: r.assets.map((a) => ({ name: a.name, url: a.browser_download_url, size: a.size })),
                }));
        } catch {
            return [];
        }
    }

    async resolveVersion(name, versionSpec) {
        const versions = await this.getVersions(name);
        if (!versions.length) return null;
        if (!versionSpec || versionSpec === 'latest') return versions[0].version;
        const exact = versions.find((v) => v.version === versionSpec);
        if (exact) return exact.version;
        const sorted = versions.sort((a, b) => b.version.localeCompare(a.version, undefined, { numeric: true }));
        return sorted[0]?.version || null;
    }

    async download(name, version, destDir) {
        const releases = await getJSON(`${this.apiBase}/releases?per_page=100`, this.token);
        const release = releases.find((r) => r.tag_name === `${name}@${version}` || r.tag_name === version);
        if (!release) throw new Error(`Release ${name}@${version} not found`);
        const asset = release.assets.find((a) => a.name.endsWith('.nbpkg'));
        if (!asset) throw new Error(`No .nbpkg asset found in release ${version}`);
        return { url: asset.browser_download_url, name: asset.name };
    }

    async publish(name, version, filePath, metadata) {
        if (!this.token) throw new Error('GITHUB_TOKEN required for publish');
        const tagName = `${name}@${version}`;
        let release;
        try {
            release = await postJSON(
                `${this.apiBase}/releases`,
                { tag_name: tagName, name: `${name} v${version}`, body: metadata?.description || '' },
                this.token
            );
        } catch (e) {
            release = await getJSON(`${this.apiBase}/releases/tags/${tagName}`, this.token);
        }
        const fs = require('fs');
        const path = require('path');
        const data = fs.readFileSync(filePath);
        const fileName = path.basename(filePath);
        const uploadUrl = release.upload_url.replace('{?name,label}', `?name=${fileName}`);
        await uploadReleaseAsset(uploadUrl, 'application/octet-stream', data, this.token);
        return { success: true, url: release.html_url };
    }
}

class NpmRegistry {
    constructor() {
        this.name = 'npm';
        this.registry = process.env.NPM_REGISTRY || 'https://registry.npmjs.org';
    }

    async search(query) {
        const data = await getJSON(`${this.registry}/-/v1/search?text=${encodeURIComponent(query)}&size=20`);
        return (data.objects || []).map((o) => ({
            name: o.package.name,
            description: o.package.description || '',
            version: o.package.version,
            registry: 'npm',
        }));
    }

    async resolveVersion(name, versionSpec) {
        try {
            const data = await getJSON(`${this.registry}/${name}`);
            const versions = Object.keys(data.versions || {}).sort((a, b) =>
                b.localeCompare(a, undefined, { numeric: true })
            );
            if (!versions.length) return null;
            if (!versionSpec || versionSpec === 'latest') return data['dist-tags']?.latest || versions[0];
            const exact = versions.find((v) => v === versionSpec);
            if (exact) return exact;
            return versions[0];
        } catch {
            return null;
        }
    }

    async download(name, version) {
        const data = await getJSON(`${this.registry}/${name}/${version}`);
        return { url: data.dist?.tarball, name: `${name}-${version}.tgz` };
    }
}

class PipRegistry {
    constructor() {
        this.name = 'pip';
        this.registry = 'https://pypi.org';
    }

    async search(query) {
        const data = await getJSON(`${this.registry}/pypi/${encodeURIComponent(query)}/json`);
        return [
            {
                name: data.info?.name || query,
                description: data.info?.summary || '',
                version: data.info?.version || '',
                registry: 'pip',
            },
        ];
    }

    async resolveVersion(name, versionSpec) {
        try {
            const data = await getJSON(`${this.registry}/pypi/${name}/json`);
            return data.info?.version || null;
        } catch {
            return null;
        }
    }

    async download(name, version) {
        const data = await getJSON(`${this.registry}/pypi/${name}/${version}/json`);
        const url = data.urls?.[0]?.url;
        return { url, name: `${name}-${version}.tar.gz` };
    }
}

class CratesRegistry {
    constructor() {
        this.name = 'crates.io';
        this.registry = 'https://crates.io';
    }

    async search(query) {
        const data = await getJSON(`${this.registry}/api/v1/crates?q=${encodeURIComponent(query)}&per_page=20`);
        return (data.crates || []).map((c) => ({
            name: c.name,
            description: c.description || '',
            version: c.newest_version || '',
            registry: 'crates.io',
        }));
    }

    async resolveVersion(name, versionSpec) {
        try {
            const data = await getJSON(`${this.registry}/api/v1/crates/${name}`);
            return data.crate?.newest_version || null;
        } catch {
            return null;
        }
    }

    async download(name, version) {
        const data = await getJSON(`${this.registry}/api/v1/crates/${name}/${version}/download`);
        return { url: data.url, name: `${name}-${version}.crate` };
    }
}

class GoModulesRegistry {
    constructor() {
        this.name = 'go';
        this.proxy = 'https://proxy.golang.org';
    }

    async search(query) {
        try {
            const data = await getJSON(`${this.proxy}/${encodeURIComponent(query)}/@latest`);
            return [
                {
                    name: data.Path || query,
                    description: '',
                    version: data.Version || '',
                    registry: 'go',
                },
            ];
        } catch {
            return [];
        }
    }

    async resolveVersion(name, versionSpec) {
        try {
            const data = await getJSON(`${this.proxy}/${name}/@latest`);
            return data.Version || null;
        } catch {
            return null;
        }
    }

    async download(name, version) {
        const url = `${this.proxy}/${name}/@v/${version}.zip`;
        return { url, name: `${name.replace(/\//g, '@')}-${version}.zip` };
    }
}

class MavenRegistry {
    constructor() {
        this.name = 'maven';
        this.registry = 'https://repo1.maven.org/maven2';
    }

    async search(query) {
        const parts = query.split(':');
        if (parts.length === 2) {
            const [groupId, artifactId] = parts;
            try {
                const pomUrl = `${this.registry}/${groupId.replace(/\./g, '/')}/${artifactId}/maven-metadata.xml`;
                const { body } = await require('./http').fetch(pomUrl);
                const versionMatch = body.match(/<latest>(.*?)<\/latest>/);
                return [
                    {
                        name: `${groupId}:${artifactId}`,
                        description: '',
                        version: versionMatch?.[1] || '',
                        registry: 'maven',
                    },
                ];
            } catch {
                return [];
            }
        }
        return [];
    }

    async resolveVersion(name, versionSpec) {
        const results = await this.search(name);
        return results[0]?.version || null;
    }

    async download(name, version) {
        const [groupId, artifactId] = name.split(':');
        const groupPath = groupId.replace(/\./g, '/');
        const url = `${this.registry}/${groupPath}/${artifactId}/${version}/${artifactId}-${version}.jar`;
        return { url, name: `${artifactId}-${version}.jar` };
    }
}

const registries = {
    nebulara: new NebularaRegistry(),
    npm: new NpmRegistry(),
    pip: new PipRegistry(),
    'crates.io': new CratesRegistry(),
    go: new GoModulesRegistry(),
    maven: new MavenRegistry(),
};

function getRegistry(name) {
    return registries[name] || null;
}

function listRegistries() {
    return Object.keys(registries);
}

module.exports = { getRegistry, listRegistries, registries };
