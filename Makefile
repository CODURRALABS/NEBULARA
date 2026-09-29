# Makefile for Nebulara
# Cross-platform build (works with MinGW on Windows and gcc on Linux/macOS)

CC ?= gcc
OPT = -O2 -Wall
BUILD_DIR = build

ifeq ($(OS),Windows_NT)
    EXT = .exe
    CFLAGS = -static $(OPT)
    MKDIR = @if not exist "$(BUILD_DIR)" mkdir "$(BUILD_DIR)"
    RM = @if exist "$(BUILD_DIR)" rmdir /s /q "$(BUILD_DIR)"
    DYNLIBS = -lm
else
    EXT =
    CFLAGS = $(OPT)
    MKDIR = @mkdir -p $(BUILD_DIR)
    RM = @rm -rf $(BUILD_DIR)
    DYNLIBS = -lm
endif

NEB = $(BUILD_DIR)/nebulara$(EXT)
CLI = $(BUILD_DIR)/neb-cli$(EXT)
CG  = $(BUILD_DIR)/neb-codegen$(EXT)
PL  = $(BUILD_DIR)/neb-pipeline$(EXT)
FFI = $(BUILD_DIR)/neb-ffi$(EXT)
KG  = $(BUILD_DIR)/neb-knowledge$(EXT)

all: $(NEB) $(CLI) $(CG) $(PL) $(FFI) $(KG)

$(NEB): Compiler/nbs-bootstrap.c
	$(MKDIR)
	$(CC) $(CFLAGS) $< -o $@ $(DYNLIBS)

$(CLI): Compiler/nbs_cli.c
	$(MKDIR)
	$(CC) $(CFLAGS) $< -o $@ $(DYNLIBS)

$(CG): Compiler/neb-codegen.c
	$(MKDIR)
	$(CC) $(CFLAGS) -DCODEGEN_STANDALONE $< -o $@

$(PL): Compiler/neb-pipeline.c
	$(MKDIR)
	$(CC) $(OPT) $< -o $@ $(DYNLIBS)

$(FFI): Compiler/neb-ffi.c
	$(MKDIR)
	$(CC) $(CFLAGS) $< -o $@ $(DYNLIBS)

$(KG): Compiler/neb-knowledge.c
	$(MKDIR)
	$(CC) $(CFLAGS) $< -o $@ $(DYNLIBS)

test: $(NEB)
	$(NEB) test/hello.nbs

test-all: all
	@echo === Interpreter ===
	$(NEB) test/hello.nbs
	@echo === Pipeline ===
	$(PL) test/hello.nbs
	@echo === JS ===
	$(PL) test/hello.nbs --target js
	@echo === Python ===
	$(PL) test/hello.nbs --target py

clean:
	$(RM)

.PHONY: all test test-all clean
