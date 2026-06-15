// Nebulara Self-Hosted Compiler & Runtime
// VM/bootstrap.c - Native x64 Windows PE

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

// Tokenizer
typedef struct { int type; int64_t int_val; char str_val[256]; } Token;
#define TOK_IDENT 1; #define TOK_INT 2; #define TOK_STRING 3
#define TOK_FUNC 4; #define TOK_RUN 5; #define TOK_END 6
#define TOK_LPAREN 7; #define TOK_RPAREN 8; #define TOK_EOF 9

int is_kw(const char* s) {
    if (strcmp(s,"FUNC!")==0) return TOK_FUNC;
    if (strcmp(s,"RUN!")==0) return TOK_RUN;
    if (strcmp(s,"END!")==0) return TOK_END;
    return TOK_IDENT;
}

void tokenize(const char* src, Token* toks, int* n) {
    int pos=0, len=strlen(src);
    *n=0;
    while (pos<len) {
        while (src[pos]==' '||src[pos]=='\n') pos++;
        if (src[pos]>='0'&&src[pos]<='9') {
            Token t={TOK_INT};
            t.int_val=0;
            while (src[pos]>='0'&&src[pos]<='9') t.int_val=t.int_val*10+src[pos++]-'0';
            toks[(*n)++]=t;
        } else if (src[pos]>='a'&&src[pos]<='z') {
            int start=pos;
            while ((src[pos]>='a'&&src[pos]<='z')||src[pos]=='!'||src[pos]=='.') pos++;
            char buf[32]; strncpy(buf,src+start,pos-start); buf[pos-start]=0;
            toks[(*n)++]=(Token){is_kw(buf)};
        } else { pos++; }
    }
    toks[(*n)++]=(Token){TOK_EOF};
}

// Bytecode buffer
uint8_t code[4096]; int cp=0;

void emit1(int b) { code[cp++]=b; }
void emit4(int v) { for(int i=0;i<4;i++) code[cp++]=v>>i*8; }
void emit8(int64_t v) { for(int i=0;i<8;i++) code[cp++]=v>>i*8; }

// Compile .nbs to bytecode
void compile_nbs(const char* src) {
    Token toks[256]; int n;
    tokenize(src, toks, &n);
    int i=0;
    while (i<n && toks[i].type!=TOK_EOF) {
        if (toks[i].type==TOK_FUNC) {
            i++; // ident
            i++; // (
            i++; // )
            i++; // RUN!
            while (toks[i].type!=TOK_END && toks[i].type!=TOK_EOF) {
                if (toks[i].type==TOK_INT) {
                    emit1(OP_PUSH_INT);
                    emit8(toks[i].int_val);
                }
                i++;
            }
            i++; // END!
        } else i++;
    }
}

// VM
int64_t stack[1024]; int sp=0;

int vm_run(uint8_t* code, int len) {
    uint8_t* ip=code;
    while (ip<code+len) {
        switch (*ip++) {
            case OP_PUSH_INT: stack[sp++]=*(int64_t*)ip; ip+=8; break;
            case OP_ADD: { int64_t b=stack[--sp]; stack[sp-1]+=b; } break;
            case OP_SUB: { int64_t b=stack[--sp]; stack[sp-1]-=b; } break;
            case OP_PRINT: {
                char buf[32]; int l=snprintf(buf,32,"%lld\n",stack[--sp]);
                WriteFile(GetStdHandle(-11),buf,l,(DWORD[]){0},0);
            } break;
            case OP_SYSCALL: ExitProcess(ip[-1]==0x24?0:1); break;
        }
    }
    return 0;
}

// PE generation
int write_pe(const char* path) {
    FILE* f=fopen(path,"wb");
    unsigned char hdr[1024]={0};
    hdr[0]='M'; hdr[1]='Z'; *(uint32_t*)(hdr+60)=0x80;
    hdr[0x80]='P'; hdr[0x81]='E'; hdr[0x81+2]=0; hdr[0x81+3]=0;
    *(uint16_t*)(hdr+0x84)=0x8664;
    *(uint16_t*)(hdr+0x86)=2;
    *(uint32_t*)(hdr+0x98)=0x200;
    memcpy(hdr+0x180,".text",8); *(uint32_t*)(hdr+0x188)=cp; *(uint32_t*)(hdr+0x194)=0x200;
    memcpy(hdr+0x1A0,".data",8); *(uint32_t*)(hdr+0x1A8)=0x1000; *(uint32_t*)(hdr+0x1B4)=0x200+((cp+0xFFF)&~0xFFF);
    fwrite(hdr,1,0x200,f);
    fwrite(code,1,cp,f);
    unsigned char z[4096]={0}; fwrite(z,1,4096,f);
    fclose(f);
    return 0;
}

int main(int argc, char** argv) {
    if (argc>2) {
        // Compile mode
        FILE* f=fopen(argv[1],"rb");
        fseek(f,0,2); int len=ftell(f); fseek(f,0,0);
        char* src=(char*)malloc(len+1);
        fread(src,1,len,f); src[len]=0; fclose(f);
        compile_nbs(src);
        write_pe(argv[2]);
        printf("Compiled %s -> %s\n",argv[1],argv[2]);
        return 0;
    } else {
        // Execute mode
        int64_t program[]={OP_PUSH_INT,42,OP_PRINT,OP_SYSCALL,0x24};
        vm_init(program,sizeof(program));
        return vm_run();
    }
}

// Native heap allocator
Value vm_alloc(size_t size) {
    Value result;
    result.ptr = vm.heap_ptr;
    vm.heap_ptr = (void*)((char*)vm.heap_ptr + size);
    return result;
}

// Execute bytecode
int vm_run(void) {
    while (vm.ip < vm.bytecode + vm.bytecode_size) {
        switch (*vm.ip++) {
            case OP_PUSH_INT:
                memcpy(&vm.stack_top->i, vm.ip, 8);
                vm.ip += 8;
                vm_stack_top++;
                break;
                
            case OP_ADD: {
                Value b = *--vm.stack_top;
                Value a = *--vm.stack_top;
                Value result;
                result.i = a.i + b.i;
                *vm.stack_top++ = result;
                break;
            }
            
            case OP_SUB: {
                Value b = *--vm.stack_top;
                Value a = *--vm.stack_top;
                Value result;
                result.i = a.i - b.i;
                *vm.stack_top++ = result;
                break;
            }
            
            case OP_PRINT: {
                Value v = *--vm.stack_top;
                char buf[32];
                int len = snprintf(buf, 32, "%lld\n", v.i);
                HANDLE h = GetStdHandle(STD_OUTPUT_HANDLE);
                DWORD written;
                WriteFile(h, buf, len, &written, NULL);
                break;
            }
            
            case OP_ALLOC: {
                memcpy(&len, vm.ip, 4);
                vm.ip += 4;
                Value result = vm_alloc(len);
                *vm.stack_top++ = result;
                break;
            }
            
            case OP_SYSCALL: {
                uint8_t sys = *vm.ip++;
                switch (sys) {
                    case 0x24: // NtTerminateProcess
                        ExitProcess(0);
                }
                break;
            }
        }
    }
    return 0;
}

// Nebulara entry point
int main(int argc, char** argv) {
    // Embedded bytecode for testing
    static uint8_t bytecode[] = {
        OP_PUSH_INT, 0x2A, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // 42
        OP_PRINT,
        OP_SYSCALL, 0x24  // Exit
    };
    
    vm_init(bytecode, sizeof(bytecode));
    return vm_run();
}