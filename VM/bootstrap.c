// Nebulara Bytecode Interpreter - Bare Metal x64
// VM/bootstrap.c
// Self-hosted Nebulara runtime

#include <windows.h>
#include <stdint.h>
#include <stddef.h>

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

// Value types
typedef union {
    int64_t i;
    double f;
    void* ptr;
    char* str;
} Value;

// VM state
typedef struct {
    uint8_t* bytecode;
    size_t bytecode_size;
    Value* stack;
    Value* stack_top;
    size_t stack_capacity;
    uint8_t* ip;
    void* heap_base;
    size_t heap_size;
    void* heap_ptr;
} VM;

static VM vm;

// Initialize VM
void vm_init(void* bytecode, size_t bytecode_size) {
    vm.bytecode = bytecode;
    vm.bytecode_size = bytecode_size;
    vm.ip = bytecode;
    vm.stack = VirtualAlloc(NULL, 1024 * 1024, MEM_COMMIT | MEM_RESERVE, PAGE_READWRITE);
    vm.stack_top = vm.stack;
    vm.stack_capacity = 1024 * 1024;
    vm.heap_base = VirtualAlloc(NULL, 16 * 1024 * 1024, MEM_COMMIT | MEM_RESERVE, PAGE_READWRITE);
    vm.heap_ptr = vm.heap_base;
    vm.heap_size = 16 * 1024 * 1024;
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