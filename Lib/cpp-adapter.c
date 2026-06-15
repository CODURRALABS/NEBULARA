// C++ FFI Adapter
// Lib/cpp-adapter.c
// Direct DLL loading for native interop

#include <windows.h>

// Load native DLL
void* load_cpp(const char* path) {
    return LoadLibraryA(path);
}

// Get function pointer
void* get_export(void* dll, const char* name) {
    return GetProcAddress((HMODULE)dll, name);
}

// Call native function (cdecl convention)
// NOTE: Requires linking with actual DLL and function signatures
int64_t call_native(void* func, int64_t* args, int count) {
    // Placeholder - actual FFI requires inline assembly
    // or libffi integration
    return 0;
}