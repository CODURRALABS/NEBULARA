'use strict';

const https = require('https');
const http = require('http');
const { URL } = require('url');

function fetch(url, opts = {}) {
    return new Promise((resolve, reject) => {
        const parsed = new URL(url);
        const mod = parsed.protocol === 'https:' ? https : http;
        const reqOpts = {
            hostname: parsed.hostname,
            port: parsed.port,
            path: parsed.pathname + parsed.search,
            method: opts.method || 'GET',
            headers: opts.headers || {},
        };
        const req = mod.request(reqOpts, (res) => {
            const chunks = [];
            res.on('data', (c) => chunks.push(c));
            res.on('end', () => {
                const body = Buffer.concat(chunks).toString('utf8');
                resolve({ status: res.statusCode, headers: res.headers, body });
            });
        });
        req.on('error', reject);
        if (opts.body) req.write(opts.body);
        req.end();
    });
}

function getJSON(url, token) {
    const headers = { Accept: 'application/json', 'User-Agent': 'nebulara-cli' };
    if (token) headers.Authorization = `token ${token}`;
    return fetch(url, { headers }).then((r) => {
        if (r.status >= 400) throw new Error(`HTTP ${r.status}: ${r.body.slice(0, 200)}`);
        return JSON.parse(r.body);
    });
}

function postJSON(url, data, token) {
    const headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'nebulara-cli',
    };
    if (token) headers.Authorization = `token ${token}`;
    return fetch(url, { method: 'POST', headers, body: JSON.stringify(data) }).then((r) => {
        if (r.status >= 400) throw new Error(`HTTP ${r.status}: ${r.body.slice(0, 200)}`);
        return JSON.parse(r.body);
    });
}

function uploadReleaseAsset(url, contentType, data, token) {
    const headers = {
        'Content-Type': contentType,
        'Content-Length': data.length,
        'User-Agent': 'nebulara-cli',
    };
    if (token) headers.Authorization = `token ${token}`;
    return fetch(url, { method: 'POST', headers, body: data }).then((r) => {
        if (r.status >= 400) throw new Error(`Upload failed HTTP ${r.status}`);
        return JSON.parse(r.body);
    });
}

module.exports = { fetch, getJSON, postJSON, uploadReleaseAsset };
