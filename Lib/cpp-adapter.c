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

// Call with cdecl calling convention
int64_t call_cdecl(void* func, int64_t* args, int count) {
    // cdecl: args on stack, caller cleans up
    __asm {
        pushad
        mov esi, args
        mov ecx, count
        // Push args in reverse
        .loop:
            test ecx, ecx
            jz .done
            mov eax, [esi + (ecx-1)*8]
            push eax
            dec ecx
            jmp .loop
        .done:
        call func
        popad
    }
}