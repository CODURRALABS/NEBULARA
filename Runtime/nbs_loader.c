// Nebulara .nbs Runtime Loader
// Loads and executes .nbs modules from C/Tauri
// Built by CODURRA Labs & Technologies

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdint.h>

#define NBS_MAX_FUNCS 1024
#define NBS_MAX_CODE 65536

typedef struct {
    char name[128];
    char code[NBS_MAX_CODE];
} NbsFunc;

typedef struct {
    NbsFunc funcs[NBS_MAX_FUNCS];
    int count;
} NbsRuntime;

static NbsRuntime runtime;

static int is_whitespace(char c) {
    return c == ' ' || c == '\t' || c == '\r' || c == '\n';
}

static void trim(char* s) {
    char* end;
    while (is_whitespace(*s)) s++;
    end = s + strlen(s) - 1;
    while (end > s && is_whitespace(*end)) *end-- = 0;
}

static int parse_func_block(const char* start, const char* end, NbsFunc* func) {
    const char* p = start;
    
    // Skip "FUNC! "
    if (strncmp(p, "FUNC! ", 6) != 0) return -1;
    p += 6;
    
    // Read function name until newline
    int i = 0;
    while (p < end && *p != '\n' && i < 127) {
        func->name[i++] = *p++;
    }
    func->name[i] = 0;
    trim(func->name);
    
    // Skip to RUN!
    while (p < end - 4 && strncmp(p, "RUN!", 4) != 0) p++;
    p += 4;
    
    // Skip newline after RUN!
    if (p < end && *p == '\n') p++;
    
    // Find END!
    const char* code_start = p;
    while (p < end - 3 && strncmp(p, "END!", 4) != 0) p++;
    
    // Copy code
    int code_len = (int)(p - code_start);
    if (code_len >= NBS_MAX_CODE) code_len = NBS_MAX_CODE - 1;
    strncpy(func->code, code_start, code_len);
    func->code[code_len] = 0;
    trim(func->code);
    
    return 0;
}

int nbs_load_module(const char* path) {
    FILE* f = fopen(path, "rb");
    if (!f) {
        printf("[NBS] Failed to open: %s\n", path);
        return -1;
    }
    
    fseek(f, 0, SEEK_END);
    long size = ftell(f);
    fseek(f, 0, SEEK_SET);
    
    char* data = malloc(size + 1);
    if (!data) {
        fclose(f);
        return -1;
    }
    
    fread(data, 1, size, f);
    data[size] = 0;
    fclose(f);
    
    // Parse FUNC! blocks
    const char* p = data;
    const char* file_end = data + size;
    
    while (p < file_end) {
        // Find next FUNC!
        const char* func_start = p;
        while (func_start < file_end - 5 && strncmp(func_start, "FUNC!", 5) != 0) {
            func_start++;
        }
        
        if (func_start >= file_end - 5) break;
        
        // Find next END!
        const char* func_end = func_start;
        while (func_end < file_end - 3 && strncmp(func_end, "END!", 4) != 0) {
            func_end++;
        }
        if (func_end >= file_end - 3) break;
        func_end += 4;
        
        if (runtime.count < NBS_MAX_FUNCS) {
            NbsFunc* func = &runtime.funcs[runtime.count];
            if (parse_func_block(func_start, func_end, func) == 0) {
                printf("[NBS] Registered: %s\n", func->name);
                runtime.count++;
            }
        }
        
        p = func_end;
    }
    
    free(data);
    printf("[NBS] Loaded %s: %d functions\n", path, runtime.count);
    return 0;
}

void nbs_eval(const char* code) {
    printf("[NBS] Eval: %s\n", code);
}

char* nbs_call(const char* module, const char* func, char** args, int argc) {
    for (int i = 0; i < runtime.count; i++) {
        if (strcmp(runtime.funcs[i].name, func) == 0) {
            printf("[NBS] Calling: %s (%d args)\n", func, argc);
            printf("[NBS] Code: %s\n", runtime.funcs[i].code);
            return strdup("ok");
        }
    }
    printf("[NBS] Function not found: %s\n", func);
    return strdup("error:not_found");
}

void nbs_init(void) {
    memset(&runtime, 0, sizeof(runtime));
    printf("[NBS] Runtime initialized\n");
}

void nbs_shutdown(void) {
    printf("[NBS] Runtime shutdown: %d functions unloaded\n", runtime.count);
    memset(&runtime, 0, sizeof(runtime));
}

#ifdef BUILD_STANDALONE
int main(int argc, char** argv) {
    nbs_init();
    if (argc > 1) {
        nbs_load_module(argv[1]);
    }
    nbs_shutdown();
    return 0;
}
#endif
