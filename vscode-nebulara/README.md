<p align="center">
  <img src="logo.png" alt="Nebulara Logo" width="140"/>
</p>

# Nebulara VS Code Extension


Official language support for **Nebulara** - the AI-native universal programming language.

This extension provides robust support for editing, syntax highlighting, checking, transpiling, and running Nebulara source files (`.nbs`, `.neb`).

## Features

- **Syntax Highlighting**: Complete TM grammar support for Nebulara keywords (`FUNC!`, `DATA!`, `IF?`, `ELSE`, `FOR!`, `END!`, etc.), operators, strings, numbers, comments, and builtins.
- **Language Configuration**: Automatic bracket matching, auto-closing pairs, and comment formatting.
- **On-the-fly Semantic Verification**: Highlights compilation and type errors directly in the editor when opening or saving files.
- **Integrated Run Commands**: Fast shortcuts to run or transpile your code.

## Commands

The extension registers the following commands, available in the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`):

- **Nebulara: Run File** (`nebulara.run`): Runs the current file using the `nebulara` interpreter in the terminal.
- **Nebulara: Semantic Check** (`nebulara.check`): Performs semantic validation and type checks on the current file.
- **Nebulara: Transpile to JavaScript** (`nebulara.transpileJS`): Transpiles the active file to JavaScript.
- **Nebulara: Transpile to Python** (`nebulara.transpilePY`): Transpiles the active file to Python.

## Requirements

The extension searches for the Nebulara compiler/interpreter binary (`nebulara.exe` / `nebulara`) in:
1. The `build/` directory of the active workspace.
2. The root of the active workspace.
3. The system `PATH` (fallback).

Ensure you have built the compiler or have it installed globally on your machine.

## Extension Settings

This extension currently does not require any custom settings.

## License

Proprietary - Copyright (c) 2026 CODURRA Labs & Technologies.
