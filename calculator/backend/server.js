'use strict';
/**
 * Nebulara Calculator Bridge Server
 * server.js
 *
 * A thin Node.js HTTP server that:
 *  1. Receives POST /calc  { op, a, b }
 *  2. Writes  request.json
 *  3. Spawns  nebulara.exe calc-engine.nbs
 *  4. Reads   response.json
 *  5. Returns the JSON result
 *
 * Also serves the frontend static files (GET /).
 */

const http  = require('http');
const fs    = require('fs');
const path  = require('path');
const { execSync } = require('child_process');

// ── Paths ────────────────────────────────────────────────────────────────────
const ROOT       = path.resolve(__dirname, '../..');          // nebulara root
const FRONTEND   = path.resolve(__dirname, '../frontend');
const REQ_FILE   = path.resolve(__dirname, 'request.json');
const RESP_FILE  = path.resolve(__dirname, 'response.json');
const NEB_EXE    = path.resolve(ROOT, 'build', 'nebulara.exe');
const ENGINE_NBS = 'calculator/backend/calc-engine.nbs';      // relative to ROOT
const PORT       = 3000;

// ── MIME types for static files ───────────────────────────────────────────────
const MIME = {
    '.html': 'text/html',
    '.css':  'text/css',
    '.js':   'application/javascript',
    '.png':  'image/png',
    '.ico':  'image/x-icon',
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function sendJSON(res, status, obj) {
    const body = JSON.stringify(obj);
    res.writeHead(status, {
        'Content-Type':                'application/json',
        'Access-Control-Allow-Origin': '*',
        'Content-Length':              Buffer.byteLength(body),
    });
    res.end(body);
}

function sendFile(res, filePath) {
    const ext  = path.extname(filePath);
    const mime = MIME[ext] || 'text/plain';
    try {
        const data = fs.readFileSync(filePath);
        res.writeHead(200, { 'Content-Type': mime });
        res.end(data);
    } catch {
        res.writeHead(404);
        res.end('Not found');
    }
}

// ── Core: invoke Nebulara engine ──────────────────────────────────────────────
function runEngine(op, a, b) {
    // Write request
    fs.writeFileSync(REQ_FILE, JSON.stringify({ op, a, b }));

    // Remove stale response
    if (fs.existsSync(RESP_FILE)) fs.unlinkSync(RESP_FILE);

    // Run Nebulara interpreter (sync, short-lived)
    try {
        execSync(`"${NEB_EXE}" ${ENGINE_NBS}`, {
            cwd:     ROOT,
            timeout: 5000,
        });
    } catch (err) {
        return { result: 0, error: `Engine error: ${err.message}` };
    }

    // Read response
    if (!fs.existsSync(RESP_FILE)) {
        return { result: 0, error: 'Engine produced no response' };
    }
    try {
        return JSON.parse(fs.readFileSync(RESP_FILE, 'utf8'));
    } catch {
        return { result: 0, error: 'Invalid JSON from engine' };
    }
}

// ── HTTP Server ───────────────────────────────────────────────────────────────
const server = http.createServer((req, res) => {

    // CORS preflight
    if (req.method === 'OPTIONS') {
        res.writeHead(204, { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type' });
        return res.end();
    }

    // POST /calc  ─ calculator API
    if (req.method === 'POST' && req.url === '/calc') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            let payload;
            try { payload = JSON.parse(body); }
            catch { return sendJSON(res, 400, { result: 0, error: 'Bad JSON' }); }

            const op = String(payload.op || '');
            const a  = Number(payload.a  ?? 0);
            const b  = Number(payload.b  ?? 0);

            if (!op) return sendJSON(res, 400, { result: 0, error: 'Missing op' });

            const result = runEngine(op, a, b);
            sendJSON(res, 200, result);
        });
        return;
    }

    // GET /  ─ serve frontend
    if (req.method === 'GET') {
        let filePath = req.url === '/' ? '/index.html' : req.url;
        filePath = path.join(FRONTEND, filePath);

        // Safety: prevent directory traversal
        if (!filePath.startsWith(FRONTEND)) {
            res.writeHead(403); return res.end('Forbidden');
        }
        return sendFile(res, filePath);
    }

    res.writeHead(404);
    res.end('Not found');
});

server.listen(PORT, () => {
    console.log(`\n  Nebulara Calculator`);
    console.log(`  Backend : ${NEB_EXE}`);
    console.log(`  Engine  : ${ENGINE_NBS}`);
    console.log(`  Open    : http://localhost:${PORT}\n`);
});
