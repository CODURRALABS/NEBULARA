// Nebulara Node.js Runtime Loader
// Loads and executes .nbs modules in Node.js

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// SHA256 helper
function sha256(text) {
  return crypto.createHash('sha256').update(text).digest('hex');
}

// Parse .nbs file
function parseNbsFile(content) {
  const functions = {};
  const dataDefs = {};
  
  // Parse DATA! blocks
  const dataRegex = /DATA!\s+"([^"]+)"\s+([\s\S]*?)END!/g;
  let dataMatch;
  while ((dataMatch = dataRegex.exec(content)) !== null) {
    const name = dataMatch[1];
    const body = dataMatch[2];
    dataDefs[name] = parseDataBody(body);
  }
  
  // Parse FUNC! blocks
  const funcRegex = /FUNC!\s+"([^"]+)"\s+RUN!\s+([\s\S]*?)END!/g;
  let funcMatch;
  while ((funcMatch = funcRegex.exec(content)) !== null) {
    const name = funcMatch[1];
    const body = funcMatch[2].trim();
    functions[name] = body;
  }
  
  return { dataDefs, functions };
}

function parseDataBody(body) {
  const obj = {};
  const lines = body.split('\n').filter(l => l.trim() && !l.trim().startsWith('#'));
  for (const line of lines) {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      obj[key.trim()] = valueParts.join('=').trim();
    }
  }
  return obj;
}

// Execute a function body
function executeNbsFunction(body, state, args) {
  // Very simple interpreter - just log for now
  // Real implementation would parse and execute NBS opcodes
  return { result: body, args };
}

class NbsRuntime {
  constructor() {
    this.functions = {};
    this.data = {};
    this.state = {};
  }
  
  loadModule(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const { dataDefs, functions } = parseNbsFile(content);
    this.data = { ...this.data, ...dataDefs };
    this.functions = { ...this.functions, ...functions };
    console.log(`[NBS] Loaded ${filePath}: ${Object.keys(functions).length} functions`);
    return this;
  }
  
  call(name, args) {
    if (this.functions[name]) {
      return executeNbsFunction(this.functions[name], this.state, args);
    }
    console.log(`[NBS] Function not found: ${name}`);
    return null;
  }
}

export { NbsRuntime, parseNbsFile, sha256 };