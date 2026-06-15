// Python FFI Adapter  
// Lib/python-adapter.c
// Embeds CPython for Nebulara FFI

#include <windows.h>

// CPython API entry points
typedef void* (*Py_Initialize_t)();
typedef void* (*PyRun_SimpleString_t)(const char*);
typedef void* (*Py_Finalize_t)();

void* python_init() {
    HMODULE py = LoadLibraryA("python3.dll");
    if (!py) return NULL;
    
    Py_Initialize_t init = (Py_Initialize_t)GetProcAddress(py, "Py_Initialize");
    if (init) init();
    
    return py;
}

int call_python(void* py, const char* code) {
    PyRun_SimpleString_t run = (PyRun_SimpleString_t)GetProcAddress((HMODULE)py, "PyRun_SimpleString");
    if (!run) return -1;
    
    char buf[1024];
    snprintf(buf, 1024, "exec('%s')", code);
    return run(buf);
}