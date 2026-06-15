// Nebulara Bootstrap Compiler
// Compiler/nbs-bootstrap.c
// Compiles .nbs to x64 PE executable

#include <windows.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

// Nebulara opcodes
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

// Simple tokenizer
typedef struct {
    int type;
    char value[256];
    int int_val;
} Token;

#define MAX_TOKENS 1024
Token tokens[MAX_TOKENS];
int token_count = 0;
int current_token = 0;

// Token types
#define TOK_IDENT 1
#define TOK_INT   2
#define TOK_STRING 3
#define TOK_FUNC  4
#define TOK_DATA  5
#define TOK_RUN   6
#define TOK_END   7
#define TOK_LPAREN 8
#define TOK_RPAREN 9
#define TOK_LBRACE 10
#define TOK_RBRACE 11
#define TOK_NEWLINE 12
#define TOK_EOF 13

int is_keyword(const char* s) {
    if (strcmp(s, "FUNC!") == 0) return TOK_FUNC;
    if (strcmp(s, "DATA!") == 0) return TOK_DATA;
    if (strcmp(s, "RUN!") == 0) return TOK_RUN;
    if (strcmp(s, "END!") == 0) return TOK_END;
    return TOK_IDENT;
}

int is_alpha(char c) {
    return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || c == '_';
}

int is_digit(char c) {
    return c >= '0' && c <= '9';
}

int is_alnum(char c) {
    return is_alpha(c) || is_digit(c);
}

void tokenize(const char* source) {
    int pos = 0;
    int len = strlen(source);
    token_count = 0;
    
    while (pos < len) {
        while (source[pos] == ' ' || source[pos] == '\t') pos++;
        
        if (source[pos] == 0) break;
        
        if (is_alpha(source[pos])) {
            int start = pos;
            while (is_alnum(source[pos])) pos++;
            int type = is_keyword(&source[start]);
            strncpy(tokens[token_count].value, &source[start], pos - start);
            tokens[token_count].value[pos - start] = 0;
            tokens[token_count].type = type;
            token_count++;
        } else if (is_digit(source[pos])) {
            int start = pos;
            while (is_digit(source[pos])) pos++;
            int val = atoi(&source[start]);
            tokens[token_count].type = TOK_INT;
            tokens[token_count].int_val = val;
            token_count++;
        } else {
            switch (source[pos]) {
                case '(': tokens[token_count].type = TOK_LPAREN; token_count++; break;
                case ')': tokens[token_count].type = TOK_RPAREN; token_count++; break;
                case '{': tokens[token_count].type = TOK_LBRACE; token_count++; break;
                case '}': tokens[token_count].type = TOK_RBRACE; token_count++; break;
                case '\n': tokens[token_count].type = TOK_NEWLINE; token_count++; break;
            }
            pos++;
        }
    }
    tokens[token_count].type = TOK_EOF;
}

Token current() {
    return tokens[current_token];
}

void advance() {
    current_token++;
}

// Bytecode emitter
unsigned char bytecode[4096];
int bytecode_pos = 0;

void emit_push_int(int64_t val) {
    bytecode[bytecode_pos++] = OP_PUSH_INT;
    for (int i = 0; i < 8; i++) {
        bytecode[bytecode_pos++] = (val >> (i * 8)) & 0xFF;
    }
}

void emit_print() {
    bytecode[bytecode_pos++] = OP_PRINT;
}

void emit_add() {
    bytecode[bytecode_pos++] = OP_ADD;
}

void emit_sub() {
    bytecode[bytecode_pos++] = OP_SUB;
}

void emit_exit() {
    bytecode[bytecode_pos++] = OP_SYSCALL;
    bytecode[bytecode_pos++] = 0x24; // Exit syscall
}

// Parse and compile
void compile() {
    while (current().type != TOK_EOF) {
        if (current().type == TOK_FUNC) {
            advance(); // FUNC!
            advance(); // ident
            advance(); // (
            advance(); // )
            advance(); // RUN!
            
            while (current().type != TOK_END && current().type != TOK_EOF) {
                if (current().type == TOK_INT) {
                    int val = current().int_val;
                    advance();
                    emit_push_int(val);
                } else {
                    advance();
                }
            }
            advance(); // END!
        } else {
            advance();
        }
    }
}

// Generate PE executable
int generate_pe(const char* output_path) {
    FILE* f = fopen(output_path, "wb");
    if (!f) return 1;
    
    // PE header (DOS + PE + Optional + Sections)
    unsigned char header[1024] = {0};
    
    // DOS header
    header[0] = 'M'; header[1] = 'Z'; // e_magic
    *(uint32_t*)(header + 60) = 0x80; // e_lfanew
    
    // PE signature
    header[0x80] = 'P'; header[0x81] = 'E'; header[0x82] = 0; header[0x83] = 0;
    
    // Machine type (AMD64)
    *(uint16_t*)(header + 0x84) = 0x8664;
    
    // Sections
    *(uint16_t*)(header + 0x86) = 2; // NumberOfSections
    
    // Entry point RVA
    *(uint32_t*)(header + 0x98) = 0x200;
    
    // Section headers
    // .text section
    memcpy(header + 0x180, ".text", 8);
    *(uint32_t*)(header + 0x188) = bytecode_pos;
    *(uint32_t*)(header + 0x18C) = bytecode_pos;
    *(uint32_t*)(header + 0x194) = 0x200; // PointerToRawData
    *(uint32_t*)(header + 0x19C) = 0x200; // Characteristics (code)
    
    // .data section
    memcpy(header + 0x1A0, ".data", 8);
    *(uint32_t*)(header + 0x1A8) = 0x1000; // VirtualSize
    *(uint32_t*)(header + 0x1AC) = 0x1000; // SizeOfRawData
    *(uint32_t*)(header + 0x1B4) = 0x200 + bytecode_pos; // PointerToRawData
    
    fwrite(header, 1, 0x200, f);
    
    // Bytecode section
    fwrite(bytecode, 1, bytecode_pos, f);
    
    // Data section (placeholder)
    unsigned char zeros[4096] = {0};
    fwrite(zeros, 1, 4096, f);
    
    fclose(f);
    return 0;
}

int main(int argc, char** argv) {
    if (argc < 3) {
        printf("Usage: %s <source.nbs> <output.exe>\n", argv[0]);
        return 1;
    }
    
    // Read source
    FILE* sf = fopen(argv[1], "rb");
    if (!sf) return 1;
    
    fseek(sf, 0, SEEK_END);
    int len = ftell(sf);
    fseek(sf, 0, SEEK_SET);
    
    char* source = malloc(len + 1);
    fread(source, 1, len, sf);
    source[len] = 0;
    fclose(sf);
    
    // Compile
    tokenize(source);
    compile();
    
    // Write executable
    if (generate_pe(argv[2])) {
        printf("Error writing output\n");
        return 1;
    }
    
    printf("Compiled %s to %s\n", argv[1], argv[2]);
    return 0;
}