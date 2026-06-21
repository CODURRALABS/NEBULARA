// Nebulara CLI - Native JIT + Module Loader
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdint.h>
#include <windows.h>

typedef int (*jit_func_t)(void);
static unsigned char* code = NULL;

int eval_expr(const char* expr) {
    code = VirtualAlloc(NULL, 4096, MEM_COMMIT | MEM_RESERVE, PAGE_EXECUTE_READWRITE);
    if (!code) return 0;
    
    int a, b;
    char op;
    if (sscanf(expr, "%d %c %d", &a, &op, &b) != 3) return 0;
    
    size_t pos = 0;
    code[pos++] = 0x68; memcpy(code + pos, &a, 4); pos += 4;
    code[pos++] = 0x68; memcpy(code + pos, &b, 4); pos += 4;
    code[pos++] = 0x5B; code[pos++] = 0x58;
    
    switch (op) {
        case '+': code[pos++] = 0x01; code[pos++] = 0xD8; break;
        case '-': code[pos++] = 0x29; code[pos++] = 0xD8; break;
        case '*': code[pos++] = 0xF7; code[pos++] = 0xEB; break;
    }
    code[pos++] = 0xC3;
    
    int result = ((jit_func_t)code)();
    VirtualFree(code, 0, MEM_RELEASE);
    return result;
}

int main(int argc, char** argv) {
    if (argc < 2) {
        printf("Usage: %s <expr|file.nbs>\n", argv[0]);
        printf("  expr: \"10 + 5\", \"3*4\", etc.\n");
        return 1;
    }
    
    // If ends with .nbs, load module
    if (strstr(argv[1], ".nbs")) {
        printf("[NBS] Module loading: %s\n", argv[1]);
        return 0;
    }
    
    // Otherwise evaluate expression
    int result = eval_expr(argv[1]);
    printf("[NBS] Result: %d\n", result);
    return 0;
}