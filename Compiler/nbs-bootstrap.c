// Nebulara Self-Hosted Compiler & Runtime
// Compiler/nbs-bootstrap.c - Compiles .nbs to PE, executes bytecode

#include <windows.h>
#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

// Opcodes
#define OP_PUSH_INT   0x01
#define OP_ADD        0x02
#define OP_SUB        0x03
#define OP_PRINT      0x04
#define OP_CALL       0x05
#define OP_RET        0x06
#define OP_JUMP       0x07
#define OP_JUMP_IF    0x08
#define OP_STORE      0x09
#define OP_LOAD       0x0A
#define OP_ALLOC      0x0B
#define OP_SYSCALL    0x0C

// Token structure
typedef struct { int type; int64_t int_val; } Token;

// Token types
#define TOK_IDENT 1
#define TOK_INT 2
#define TOK_FUNC 3
#define TOK_RUN 4
#define TOK_END 5
#define TOK_EOF 6

// Is keyword check
int is_kw(const char* s) {
    if (strcmp(s, "FUNC!") == 0) return TOK_FUNC;
    if (strcmp(s, "RUN!") == 0) return TOK_RUN;
    if (strcmp(s, "END!") == 0) return TOK_END;
    return TOK_IDENT;
}

// Tokenizer
void tokenize(const char* src, Token* toks, int* count) {
    int pos = 0, len = strlen(src), n = 0;
    while (pos < len) {
        while (src[pos] == ' ' || src[pos] == '\n') pos++;
        if (src[pos] == 0) break;
        if (src[pos] >= '0' && src[pos] <= '9') {
            int val = 0;
            while (src[pos] >= '0' && src[pos] <= '9') {
                val = val * 10 + src[pos++] - '0';
            }
            toks[n++] = (Token){TOK_INT, val};
        } else if (src[pos] >= 'a' && src[pos] <= 'z') {
            int start = pos;
            while ((src[pos] >= 'a' && src[pos] <= 'z') || src[pos] == '!') pos++;
            char buf[32];
            int slen = pos - start;
            strncpy(buf, src + start, slen);
            buf[slen] = 0;
            toks[n++] = (Token){is_kw(buf)};
        } else {
            pos++;
        }
    }
    toks[n] = (Token){TOK_EOF};
    *count = n + 1;
}

// Bytecode buffer
uint8_t bytecode[4096];
int bytecode_pos = 0;

void emit_push_int(int64_t v) {
    bytecode[bytecode_pos++] = OP_PUSH_INT;
    for (int i = 0; i < 8; i++) {
        bytecode[bytecode_pos++] = (v >> (i * 8)) & 0xFF;
    }
}

void emit_exit(void) {
    bytecode[bytecode_pos++] = OP_SYSCALL;
    bytecode[bytecode_pos++] = 0x24;
}

// Compile .nbs source
void compile_nbs(const char* src) {
    Token toks[256];
    int n;
    tokenize(src, toks, &n);
    int i = 0;
    while (i < n && toks[i].type != TOK_EOF) {
        if (toks[i].type == TOK_FUNC) {
            i++; // ident
            while (toks[i].type != TOK_RUN && toks[i].type != TOK_EOF) i++;
            i++; // RUN!
            while (toks[i].type != TOK_END && toks[i].type != TOK_EOF) {
                if (toks[i].type == TOK_INT) {
                    emit_push_int(toks[i].int_val);
                }
                i++;
            }
            i++; // END!
        } else {
            i++;
        }
    }
}

// VM execution
int64_t vm_stack[1024];
int vm_sp = 0;

int vm_run(uint8_t* code, int len) {
    int ip = 0;
    while (ip < len) {
        switch (code[ip++]) {
            case OP_PUSH_INT:
                memcpy(&vm_stack[vm_sp++], code + ip, 8);
                ip += 8;
                break;
            case OP_ADD:
                vm_stack[vm_sp - 2] += vm_stack[--vm_sp - 1];
                vm_sp--;
                break;
            case OP_PRINT: {
                int64_t v = vm_stack[--vm_sp];
                char buf[32];
                int l = snprintf(buf, 32, "%lld\n", v);
                DWORD written;
                WriteFile(GetStdHandle((DWORD)-11), buf, l, &written, NULL);
            } break;
            case OP_SYSCALL:
                if (code[ip] == 0x24) ExitProcess(0);
                ip++;
                break;
        }
    }
    return 0;
}

// PE generation
int write_pe(const char* path) {
    FILE* f = fopen(path, "wb");
    if (!f) return 1;
    
    unsigned char hdr[1024] = {0};
    hdr[0] = 'M'; hdr[1] = 'Z';
    *(uint32_t*)(hdr + 60) = 0x80;
    
    hdr[0x80] = 'P'; hdr[0x81] = 'E';
    *(uint16_t*)(hdr + 0x84) = 0x8664;
    *(uint16_t*)(hdr + 0x86) = 2;
    *(uint32_t*)(hdr + 0x98) = 0x200;
    
    memcpy(hdr + 0x180, ".text", 8);
    *(uint32_t*)(hdr + 0x188) = bytecode_pos;
    *(uint32_t*)(hdr + 0x194) = 0x200;
    
    memcpy(hdr + 0x1A0, ".data", 8);
    *(uint32_t*)(hdr + 0x1A8) = 0x1000;
    
    fwrite(hdr, 1, 0x200, f);
    fwrite(bytecode, 1, bytecode_pos, f);
    unsigned char zeros[4096] = {0};
    fwrite(zeros, 1, 4096, f);
    fclose(f);
    return 0;
}

// Main entry
int main(int argc, char** argv) {
    if (argc > 2) {
        FILE* f = fopen(argv[1], "rb");
        if (!f) return 1;
        fseek(f, 0, SEEK_END);
        int len = ftell(f);
        fseek(f, 0, SEEK_SET);
        char* src = (char*)malloc(len + 1);
        fread(src, 1, len, f);
        src[len] = 0;
        fclose(f);
        
        bytecode_pos = 0;
        compile_nbs(src);
        free(src);
        
        write_pe(argv[2]);
        printf("Compiled: %s -> %s\n", argv[1], argv[2]);
        return 0;
    } else {
        uint8_t program[] = {
            OP_PUSH_INT, 0x2A, 0, 0, 0, 0, 0, 0, 0,
            OP_PRINT,
            OP_SYSCALL, 0x24
        };
        return vm_run(program, sizeof(program));
    }
}