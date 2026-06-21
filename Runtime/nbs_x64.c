// Nebulara x64 JIT Compiler - True x64 opcodes
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdint.h>
#include <windows.h>

typedef int64_t (*jit_func_t)(void);
static unsigned char* code = NULL;

int init_jit() {
    code = VirtualAlloc(NULL, 4096, MEM_COMMIT | MEM_RESERVE, PAGE_EXECUTE_READWRITE);
    if (!code) return -1;
    memset(code, 0, 4096);
    return 0;
}

void close_jit() { VirtualFree(code, 0, MEM_RELEASE); }

int compile_expr(const char* expr) {
    int64_t a, b;
    char op;
    if (sscanf(expr, "%lld %c %lld", &a, &op, &b) != 3) return -1;
    
    size_t pos = 0;
    // mov rax, a (REX.W + B8)
    code[pos++] = 0x48; code[pos++] = 0xB8;
    memcpy(code + pos, &a, 8); pos += 8;
    
    code[pos++] = 0x50; // push rax
    
    code[pos++] = 0x48; code[pos++] = 0xB8;
    memcpy(code + pos, &b, 8); pos += 8;
    
    code[pos++] = 0x50; // push rax
    
    code[pos++] = 0x5B; // pop rbx
    code[pos++] = 0x58; // pop rax
    
    switch (op) {
        case '+': code[pos++] = 0x48; code[pos++] = 0x01; code[pos++] = 0xD8; break;
        case '-': code[pos++] = 0x48; code[pos++] = 0x29; code[pos++] = 0xD8; break;
        case '*': code[pos++] = 0x48; code[pos++] = 0xF7; code[pos++] = 0xEB; break;
    }
    code[pos++] = 0xC3; // ret
    return 0;
}

int64_t execute() {
    return ((jit_func_t)code)();
}

int main(int argc, char** argv) {
    if (argc < 2) { printf("Usage: %s <expr>\n", argv[0]); return 1; }
    if (init_jit() != 0) return 1;
    compile_expr(argv[1]);
    int64_t result = execute();
    printf("[NBS-x64] Result: %lld\n", result);
    close_jit();
    return 0;
}