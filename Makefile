# Nebulara Makefile

.PHONY: all build test clean install run

all: build

build:
	@echo "Building Nebulara..."
	node_modules/.bin/tsc --outDir dist --module ESNext --target ESNext --moduleResolution node src/index.ts --skipLibCheck
	@echo "Build complete"

test:
	@echo "Running tests..."
	node --test tests/*.test.ts

install:
	npm install -g .

run:
	node dist/index.js

clean:
	rm -rf dist
	rm -f *.o *.asm

bootstrap:
	node bootstrap-native.mjs

selfhost:
	@echo "Self-hosting compilation..."
	node -e "import('./dist/index.js').then(m => { const g = m.Nebulara(); console.log(g.compile('PRINT \"Self-hosted\"')); })"

# Compile a .nbs file
compile:
	@node -e "import('./dist/index.js').then(m => { const g = m.Nebulara(); const src = require('fs').readFileSync('$(source)', 'utf8'); require('fs').writeFileSync('$(output)', g.compile(src)); })"

.DEFAULT_GOAL := all