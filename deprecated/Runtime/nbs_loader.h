// Nebulara .nbs Runtime Loader Header
// C API for loading and executing .nbs modules

#ifndef NBS_LOADER_H
#define NBS_LOADER_H

#include <stddef.h>

#ifdef __cplusplus
extern "C" {
#endif

// Initialize the Nebulara runtime
void nbs_init(void);

// Shutdown the runtime
void nbs_shutdown(void);

// Load a .nbs module from file path
// Returns 0 on success, -1 on failure
int nbs_load_module(const char* path);

// Evaluate inline .nbs code
void nbs_eval(const char* code);

// Call a function in a loaded module
// Returns a string that must be freed with free()
char* nbs_call(const char* module, const char* func, char** args, int argc);

#ifdef __cplusplus
}
#endif

#endif // NBS_LOADER_H
