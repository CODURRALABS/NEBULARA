// Nebulara x86 JIT Compiler (32-bit compatible)
// Generates and executes x86 machine code

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdint.h>

#ifdef _WIN32
#include <windows.h>
#endif

typedef int (*jit_func_t)(void);

static unsigned char* code_buffer = NULL;
static size_t code_size = 0;

void* mmap(size_t len) {
    return VirtualAlloc(NULL, len, MEM_COMMIT | MEM_RESERVE, PAGE_EXECUTE_READWRITE);
}

void munmap(void* addr, size_t len) {
    VirtualFree(addr, 0, MEM_RELEASE);
}

int compile_binary(int a, int op, int b) {
    size_t pos = 0;
    
    // push a
    code_buffer[pos++] = 0x68;
    memcpy(code_buffer + pos, &a, 4);
    pos += 4;
    
    // push b
    code_buffer[pos++] = 0x68;
    memcpy(code_buffer + pos, &b, 4);
    pos += 4;
    
    // pop registers and compute
    switch (op) {
        case '+':
            code_buffer[pos++] = 0x5B; // pop ebx
            code_buffer[pos++] = 0x58; // pop eax
            code_buffer[pos++] = 0x01; // add eax, ebx
            code_buffer[pos++] = 0xD8;
            break;
        case '-':
            code_buffer[pos++] = 0x5B;
            code_buffer[pos++] = 0x58;
            code_buffer[pos++] = 0x29; // sub eax, ebx
            code_buffer[pos++] = 0xD8;
            break;
        case '*':
            code_buffer[pos++] = 0x5B;
            code_buffer[pos++] = 0x58;
            code_buffer[pos++] = 0xF7; // imul eax, ebx
            code_buffer[pos++] = 0xEB;
            break;
    }
    
    code_buffer[pos++] = 0xC3; // ret
    code_size = pos;
    return 0;
}

int execute_jit() {
    jit_func_t func = (jit_func_t)code_buffer;
    return func();
}

int main(int argc, char** argv) {
    fprintf(stderr, "DEBUG: argc=%d\n", argc); fflush(stderr);
    
    if (argc < 4) {
        fprintf(stderr, "Usage: %s <a> <op> <b>\n", argv[0]);
        return 1;
    }
    
    code_buffer = mmap(4096);
    if (!code_buffer) { fprintf(stderr, "JIT init failed\n"); return 1; }
    
    int a = atoi(argv[1]);
    int b = atoi(argv[3]);  // Fixed: use argv[3] directly
    char op = argv[2][0];
    
    fprintf(stderr, "[NBS-JIT] Compiling: %d %c %d\n", a, op, b); fflush(stderr);
    
    compile_binary(a, op, b);
    int result = execute_jit();
    
    munmap(code_buffer, 4096);
    
    fprintf(stderr, "[NBS-JIT] Result: %d\n", result); fflush(stderr);
    return 0;
}