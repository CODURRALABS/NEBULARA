// Node.js FFI Adapter
// Lib/nodejs-adapter.c
// Calls Node.js from native Nebulara runtime

#include <windows.h>
#include <stdio.h>

// Node.js embedding API
typedef int (*napi_f)(void);
typedef void (*napi_cb)(void*);

// Load Node.js DLL
void* load_nodejs() {
    return LoadLibraryA("node.dll");
}

// Call JavaScript function
int call_js(void* handle, const char* func_name, int64_t arg) {
    // Get function via dlsym equivalent
    napi_f js_func = (napi_f)GetProcAddress(handle, func_name);
    if (!js_func) return -1;
    return js_func();
}

// FFI bridge
int ffi_nodejs(const char* path, const char* export_name, int64_t arg) {
    void* h = load_nodejs();
    return call_js(h, export_name, arg);
}