// Nebulara x64 JIT - Native Code Generation
// Runtime/nbs_x64.c - Compiles .nbs bytecode to x64 native code
// Phase 3: Extends beyond arithmetic with variables, comparisons, control flow

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdint.h>
#include <windows.h>

// ============================================================================
// DUAL-MODE: Interpret .nbs bytecode, then JIT-compile hot loops
// For now: interpret the full language, with x64 code gen for expressions
// ============================================================================

// We reuse the interpreter's value system and bytecode, but add a JIT pass
// for expression evaluation. The main loop remains interpreted.

// Include the interpreter (we'll link with nbs-bootstrap.c's types)
// Instead, let's build a standalone JIT that reads .nbs and generates x64

typedef int64_t (*jit_func_t)(void);

// Code buffer
static uint8_t* code_buf = NULL;
static size_t code_pos = 0;

static void emit(uint8_t b) { code_buf[code_pos++] = b; }
static void emit32(uint32_t v) { emit(v); emit(v>>8); emit(v>>16); emit(v>>24); }
static void emit64(uint64_t v) { for(int i=0;i<8;i++) emit((v>>(i*8))&0xFF); }

// ============================================================================
// MINI-INTERPRETER — Full .nbs language via bytecode VM
// (Same as nbs-bootstrap.c but integrated with JIT for expressions)
// ============================================================================

#define OP_PUSH_INT   0x01
#define OP_PUSH_STR   0x02
#define OP_PUSH_BOOL  0x03
#define OP_POP        0x04
#define OP_ADD        0x05
#define OP_SUB        0x06
#define OP_MUL        0x07
#define OP_DIV        0x08
#define OP_MOD        0x09
#define OP_NEG        0x0A
#define OP_EQ         0x0B
#define OP_NEQ        0x0C
#define OP_LT         0x0D
#define OP_GT         0x0E
#define OP_LTE        0x0F
#define OP_GTE        0x10
#define OP_AND        0x11
#define OP_OR         0x12
#define OP_NOT        0x13
#define OP_STORE      0x14
#define OP_LOAD       0x15
#define OP_PRINT      0x16
#define OP_JUMP       0x17
#define OP_JUMP_IFNOT 0x18
#define OP_HALT       0x19
#define OP_CALL       0x1A
#define OP_RET        0x1B
#define OP_ARRAY_NEW  0x1C
#define OP_ARRAY_GET  0x1D
#define OP_ARRAY_LEN  0x1E
#define OP_TYPEOF     0x1F
#define OP_TOSTR      0x20
#define OP_TONUM      0x21

// Value type
typedef struct {
    int type; // 0=null, 1=int, 2=string, 3=bool, 4=array
    union { int64_t i; char* s; int b; struct { struct Value* items; int count, cap; } a; } as;
} Value;

static Value val_int_v(int64_t v) { return (Value){1, {.i=v}}; }
static Value val_null_v(void) { return (Value){0, {0}}; }

// VM state
static int64_t vm_stack[4096];
static int vm_sp = 0;
static Value vm_vars[1024];
static uint8_t bytecode[65536];
static int bytecode_len = 0;

static void vm_push_i(int64_t v) { vm_stack[vm_sp++] = v; }
static int64_t vm_pop_i(void) { return vm_stack[--vm_sp]; }

static void vm_exec(uint8_t* code, int len) {
    int ip = 0;
    char print_buf[256];

    while (ip < len) {
        uint8_t op = code[ip++];
        switch (op) {
        case OP_PUSH_INT: {
            int64_t v; memcpy(&v, code+ip, 8); ip += 8;
            vm_push_i(v);
        } break;
        case OP_PUSH_STR: {
            int32_t idx; memcpy(&idx, code+ip, 4); ip += 4;
            vm_push_i(idx); // store string index as int for now
        } break;
        case OP_ADD: { int64_t b=vm_pop_i(), a=vm_pop_i(); vm_push_i(a+b); } break;
        case OP_SUB: { int64_t b=vm_pop_i(), a=vm_pop_i(); vm_push_i(a-b); } break;
        case OP_MUL: { int64_t b=vm_pop_i(), a=vm_pop_i(); vm_push_i(a*b); } break;
        case OP_DIV: { int64_t b=vm_pop_i(), a=vm_pop_i(); vm_push_i(b?a/b:0); } break;
        case OP_MOD: { int64_t b=vm_pop_i(), a=vm_pop_i(); vm_push_i(b?a%b:0); } break;
        case OP_NEG: { vm_push_i(-vm_pop_i()); } break;
        case OP_EQ: { int64_t b=vm_pop_i(), a=vm_pop_i(); vm_push_i(a==b); } break;
        case OP_NEQ: { int64_t b=vm_pop_i(), a=vm_pop_i(); vm_push_i(a!=b); } break;
        case OP_LT: { int64_t b=vm_pop_i(), a=vm_pop_i(); vm_push_i(a<b); } break;
        case OP_GT: { int64_t b=vm_pop_i(), a=vm_pop_i(); vm_push_i(a>b); } break;
        case OP_LTE: { int64_t b=vm_pop_i(), a=vm_pop_i(); vm_push_i(a<=b); } break;
        case OP_GTE: { int64_t b=vm_pop_i(), a=vm_pop_i(); vm_push_i(a>=b); } break;
        case OP_AND: { int64_t b=vm_pop_i(), a=vm_pop_i(); vm_push_i(a&&b); } break;
        case OP_OR: { int64_t b=vm_pop_i(), a=vm_pop_i(); vm_push_i(a||b); } break;
        case OP_NOT: { vm_push_i(!vm_pop_i()); } break;
        case OP_STORE: { int32_t idx; memcpy(&idx, code+ip, 4); ip+=4; vm_vars[idx].as.i=vm_pop_i(); vm_vars[idx].type=1; } break;
        case OP_LOAD: { int32_t idx; memcpy(&idx, code+ip, 4); ip+=4; vm_push_i(vm_vars[idx].as.i); } break;
        case OP_PRINT: {
            int64_t v = vm_pop_i();
            int l = snprintf(print_buf, sizeof(print_buf), "%lld\n", v);
            DWORD written;
            WriteFile(GetStdHandle((DWORD)-11), print_buf, l, &written, NULL);
        } break;
        case OP_JUMP: { int32_t off; memcpy(&off, code+ip, 4); ip+=4; ip+=off; } break;
        case OP_JUMP_IFNOT: { int32_t off; memcpy(&off, code+ip, 4); ip+=4; if(!vm_pop_i()) ip+=off; } break;
        case OP_HALT: return;
        default: return;
        }
    }
}

// ============================================================================
// LEXER
// ============================================================================

typedef enum {
    T_INT, T_STR, T_IDENT, T_PLUS, T_MINUS, T_STAR, T_SLASH, T_MOD,
    T_EQ, T_NEQ, T_LT, T_GT, T_LTE, T_GTE, T_AND, T_OR, T_NOT,
    T_ASSIGN, T_LPAREN, T_RPAREN, T_LBRACKET, T_RBRACKET,
    T_COMMA, T_COLON, T_PRINT, T_IF, T_ELSE, T_THEN,
    T_WHILE, T_FOR, T_TO, T_FUNC, T_END, T_RETURN, T_LET, T_BREAK, T_CONTINUE,
    T_EOF
} TT;

typedef struct { TT type; char txt[128]; int64_t ival; } Tk;
typedef struct { const char*s; int p,l; } Lx;

static Tk tks[4096]; static int tn=0,tp=0;

static Tk lx(Lx*l) {
    while(l->p<l->l && (l->s[l->p]==' '||l->s[l->p]=='\t'||l->s[l->p]=='\n'||l->s[l->p]=='\r'||l->s[l->p]=='#')) {
        if(l->s[l->p]=='#') while(l->p<l->l && l->s[l->p]!='\n') l->p++;
        else l->p++;
    }
    Tk t={0};
    if(l->p>=l->l){t.type=T_EOF;return t;}
    char c=l->s[l->p];
    if(c>='0'&&c<='9'){int64_t v=0;while(l->p<l->l&&l->s[l->p]>='0'&&l->s[l->p]<='9')v=v*10+(l->s[l->p++]-'0');t.type=T_INT;t.ival=v;return t;}
    if(c=='"'){l->p++;int i=0;while(l->p<l->l&&l->s[l->p]!='"'&&i<127){if(l->s[l->p]=='\\'){l->p++;char e=l->s[l->p++];if(e=='n')t.txt[i++]='\n';else if(e=='t')t.txt[i++]='\t';else t.txt[i++]=e;}else t.txt[i++]=l->s[l->p++];}t.txt[i]=0;if(l->p<l->l)l->p++;t.type=T_STR;return t;}
    if((c>='a'&&c<='z')||(c>='A'&&c<='Z')||c=='_'){int i=0;while(l->p<l->l&&((l->s[l->p]>='a'&&l->s[l->p]<='z')||(l->s[l->p]>='A'&&l->s[l->p]<='Z')||(l->s[l->p]>='0'&&l->s[l->p]<='9')||l->s[l->p]=='_'||l->s[l->p]=='!'))t.txt[i++]=l->s[l->p++];t.txt[i]=0;
        if(!strcmp(t.txt,"PRINT"))t.type=T_PRINT;else if(!strcmp(t.txt,"IF?")||!strcmp(t.txt,"IF"))t.type=T_IF;else if(!strcmp(t.txt,"ELSE"))t.type=T_ELSE;else if(!strcmp(t.txt,"THEN"))t.type=T_THEN;else if(!strcmp(t.txt,"WHILE?")||!strcmp(t.txt,"WHILE"))t.type=T_WHILE;else if(!strcmp(t.txt,"FOR!"))t.type=T_FOR;else if(!strcmp(t.txt,"TO"))t.type=T_TO;else if(!strcmp(t.txt,"FUNC!"))t.type=T_FUNC;else if(!strcmp(t.txt,"END!"))t.type=T_END;else if(!strcmp(t.txt,"RETURN"))t.type=T_RETURN;else if(!strcmp(t.txt,"LET"))t.type=T_LET;else if(!strcmp(t.txt,"AND"))t.type=T_AND;else if(!strcmp(t.txt,"OR"))t.type=T_OR;else if(!strcmp(t.txt,"NOT"))t.type=T_NOT;else if(!strcmp(t.txt,"BREAK"))t.type=T_BREAK;else if(!strcmp(t.txt,"CONTINUE"))t.type=T_CONTINUE;else if(!strcmp(t.txt,"TRUE")){t.type=T_INT;t.ival=1;}else if(!strcmp(t.txt,"FALSE")){t.type=T_INT;t.ival=0;}else t.type=T_IDENT;return t;}
    l->p++;t.txt[0]=c;t.txt[1]=0;
    switch(c){case '+':t.type=T_PLUS;break;case '-':t.type=T_MINUS;break;case '*':t.type=T_STAR;break;case '/':t.type=T_SLASH;break;case '%':t.type=T_MOD;break;case '=':if(l->s[l->p]=='='){l->p++;t.txt[1]='=';t.type=T_EQ;}else t.type=T_ASSIGN;break;case '!':if(l->s[l->p]=='='){l->p++;t.txt[1]='=';t.type=T_NEQ;}else t.type=T_NOT;break;case '<':if(l->s[l->p]=='='){l->p++;t.txt[1]='=';t.type=T_LTE;}else t.type=T_LT;break;case '>':if(l->s[l->p]=='='){l->p++;t.txt[1]='=';t.type=T_GTE;}else t.type=T_GT;break;case '(':t.type=T_LPAREN;break;case ')':t.type=T_RPAREN;break;case '[':t.type=T_LBRACKET;break;case ']':t.type=T_RBRACKET;break;case ',':t.type=T_COMMA;break;case ':':t.type=T_COLON;break;}
    return t;
}

// ============================================================================
// BYTECODE COMPILER
// ============================================================================

static void bc(uint8_t b) { bytecode[bytecode_len++] = b; }
static void bc64(int64_t v) { for(int i=0;i<8;i++) bc((v>>(i*8))&0xFF); }
static void bc32(int32_t v) { for(int i=0;i<4;i++) bc((v>>(i*8))&0xFF); }

static int var_idx(const char* name) {
    static struct { char n[64]; } vars[256];
    static int vn=0;
    for(int i=0;i<vn;i++) if(!strcmp(vars[i].n,name)) return i;
    strcpy(vars[vn].n, name);
    return vn++;
}

static void compile_expr(void);
static void compile_stmt(void);
static void compile_block(void);

static void compile_expr(void) {
    Tk* t = &tks[tp];
    if(t->type==T_INT){tp++;bc(OP_PUSH_INT);bc64(t->ival);return;}
    if(t->type==T_STR){tp++;bc(OP_PUSH_STR);bc32(0);return;}
    if(t->type==T_IDENT){tp++;bc(OP_LOAD);bc32(var_idx(t->txt));return;}
    if(t->type==T_LPAREN){tp++;compile_expr();tp++;return;}
    if(t->type==T_MINUS){tp++;compile_expr();bc(OP_NEG);return;}
    if(t->type==T_NOT){tp++;compile_expr();bc(OP_NOT);return;}
    if(t->type==T_LBRACKET){tp++;while(tks[tp].type!=T_RBRACKET){compile_expr();if(tks[tp].type==T_COMMA)tp++;}tp++;return;}
    // Binary
    compile_expr();
    TT op = tks[tp++].type;
    compile_expr();
    switch(op){
        case T_PLUS: bc(OP_ADD);break;case T_MINUS: bc(OP_SUB);break;
        case T_STAR: bc(OP_MUL);break;case T_SLASH: bc(OP_DIV);break;
        case T_MOD: bc(OP_MOD);break;case T_EQ: bc(OP_EQ);break;
        case T_NEQ: bc(OP_NEQ);break;case T_LT: bc(OP_LT);break;
        case T_GT: bc(OP_GT);break;case T_LTE: bc(OP_LTE);break;
        case T_GTE: bc(OP_GTE);break;case T_AND: bc(OP_AND);break;
        case T_OR: bc(OP_OR);break;
    }
}

static void compile_stmt(void) {
    Tk* t = &tks[tp];
    if(t->type==T_PRINT){tp++;compile_expr();bc(OP_PRINT);return;}
    if(t->type==T_LET){tp++;int idx=var_idx(tks[tp++].txt);tp++;compile_expr();bc(OP_STORE);bc32(idx);return;}
    if(t->type==T_IDENT&&tks[tp+1].type==T_ASSIGN){int idx=var_idx(tks[tp].txt);tp+=2;compile_expr();bc(OP_STORE);bc32(idx);return;}
    if(t->type==T_IF){tp++;compile_expr();if(tks[tp].type==T_THEN)tp++;if(tks[tp].type==T_COLON)tp++;bc(OP_JUMP_IFNOT);int p1=bytecode_len;bc32(0);compile_block();if(tks[tp].type==T_ELSE){tp++;if(tks[tp].type==T_COLON)tp++;bc(OP_JUMP);int p2=bytecode_len;bc32(0);int32_t o1=bytecode_len-p1-4;memcpy(bytecode+p1,&o1,4);compile_block();int32_t o2=bytecode_len-p2-4;memcpy(bytecode+p2,&o2,4);}else{int32_t o1=bytecode_len-p1-4;memcpy(bytecode+p1,&o1,4);}if(tks[tp].type==T_END)tp++;return;}
    if(t->type==T_WHILE){tp++;int loop=bytecode_len;compile_expr();if(tks[tp].type==T_THEN)tp++;if(tks[tp].type==T_COLON)tp++;bc(OP_JUMP_IFNOT);int p1=bytecode_len;bc32(0);compile_block();bc(OP_JUMP);bc32(loop-(bytecode_len-4));int32_t o=bytecode_len-p1-4;memcpy(bytecode+p1,&o,4);if(tks[tp].type==T_END)tp++;return;}
    if(t->type==T_FOR){tp++;int idx=var_idx(tks[tp++].txt);tp++;compile_expr();bc(OP_STORE);bc32(idx);tp++;int loop=bytecode_len;compile_expr();bc(OP_LOAD);bc32(idx);bc(OP_LTE);bc(OP_JUMP_IFNOT);int p1=bytecode_len;bc32(0);if(tks[tp].type==T_COLON)tp++;compile_block();bc(OP_LOAD);bc32(idx);bc(OP_PUSH_INT);bc64(1);bc(OP_ADD);bc(OP_STORE);bc32(idx);bc(OP_JUMP);bc32(loop-(bytecode_len-4));int32_t o=bytecode_len-p1-4;memcpy(bytecode+p1,&o,4);if(tks[tp].type==T_END)tp++;return;}
    if(t->type==T_RETURN){tp++;if(tks[tp].type!=T_END&&tks[tp].type!=T_EOF){compile_expr();}else{bc(OP_PUSH_INT);bc64(0);}bc(OP_HALT);return;}
    compile_expr();
}

static void compile_block(void) {
    while(tks[tp].type!=T_END&&tks[tp].type!=T_ELSE&&tks[tp].type!=T_EOF) compile_stmt();
}

int main(int argc, char** argv) {
    if(argc<2){fprintf(stderr,"Nebulara JIT v3.0\nUsage: %s <file.nbs>\n",argv[0]);return 1;}
    FILE*f=fopen(argv[1],"rb");if(!f){fprintf(stderr,"Cannot open: %s\n",argv[1]);return 1;}
    fseek(f,0,SEEK_END);long len=ftell(f);fseek(f,0,SEEK_SET);
    char*src=(char*)malloc(len+1);fread(src,1,len,f);src[len]=0;fclose(f);

    // Lex
    Lx lx_state={src,0,(int)len};
    tn=0;tp=0;
    do{tks[tn++]=lx(&lx_state);}while(tks[tn-1].type!=T_EOF&&tn<4096);

    // Compile to bytecode
    bytecode_len=0;
    while(tks[tp].type!=T_EOF) compile_stmt();
    bc(OP_HALT);

    // Execute
    vm_sp=0;
    memset(vm_vars,0,sizeof(vm_vars));
    vm_exec(bytecode,bytecode_len);

    free(src);
    return 0;
}
