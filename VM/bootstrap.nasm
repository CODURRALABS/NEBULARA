; Nebulara Native Runtime - x64 Windows PE
; VM/bootstrap.nasm
; Self-hosted bytecode interpreter

default rel
bits 64

section .text
global _start

; Nebulara bytecode format:
; 0x01 nn - PUSH_INT (nn = 8-byte little-endian)
; 0x02 - ADD (pop 2, push sum)
; 0x03 - SUB (pop 2, push diff)
; 0x04 - PRINT (pop, write to stdout)
; 0x05 xx xx - CALL (2-byte offset)
; 0x06 - RET
; 0x07 xx xx - JUMP (2-byte offset)
; 0x08 xx xx - JUMP_IF (2-byte offset, pop, jump if non-zero)
; 0x09 - STORE (pop value, pop name, store in env)
; 0x0A - LOAD (push env[name])
; 0x0B nn - ALLOC (nn = 4-byte size, returns ptr)
; 0x0C nn - SYSCALL (nn = 1-byte syscall number)

_start:
    ; Initialize Nebulara VM
    and rsp, -16          ; 16-byte align stack
    sub rsp, 0x10000      ; 64KB stack scratch
    
    ; Setup heap (16MB)
    mov rcx, -1           ; Current process handle
    lea rdx, [heap_size]  ; Size
    mov r8, 0x3000        ; MEM_COMMIT | MEM_TOPDOWN
    mov r9, 0x04          ; PAGE_READWRITE
    call [NtAllocateVirtualMemory]
    mov qword [heap_base], rax
    
    ; Setup bytecode pointer
    lea rsi, [bytecode_start]
    lea rdi, [heap_base]
    
    ; Initialize stack pointer
    lea rbp, [stack_top]
    
.run_loop:
    lodsb                 ; Load next opcode
    cmp al, 0x01
    je .push_int
    cmp al, 0x02
    je .add
    cmp al, 0x03
    je .sub
    cmp al, 0x04
    je .print
    cmp al, 0x05
    je .call
    cmp al, 0x06
    je .ret
    cmp al, 0x07
    je .jump
    cmp al, 0x08
    je .jump_if
    cmp al, 0x0B
    je .alloc
    cmp al, 0x0C
    je .syscall
    jmp .run_loop

.push_int:
    ; Read 8 bytes as int64
    movsq
    push rax
    jmp .run_loop

.add:
    pop rax
    pop rcx
    add rax, rcx
    push rax
    jmp .run_loop

.sub:
    pop rax
    pop rcx
    sub rcx, rax
    push rcx
    jmp .run_loop

.print:
    ; Pop value, convert to decimal, write
    pop rax
    call int_to_str
    mov rcx, -11          ; STD_OUTPUT_HANDLE
    call [GetStdHandle]
    mov r8, rsi           ; String pointer
    mov r9, rdi           ; Length
    xor edx, edx          ; No overlapped
    xor ebx, ebx
    call [WriteConsoleA]
    jmp .run_loop

.call:
    ; 2-byte offset
    lodsw
    lea rsi, [bytecode_start + rax]
    jmp .run_loop

.ret:
    ; Return from call - for now just continue
    jmp .run_loop

.jump:
    ; 2-byte offset
    lodsw
    lea rsi, [bytecode_start + rax]
    jmp .run_loop

.jump_if:
    ; Pop condition, jump if non-zero
    pop rax
    test rax, rax
    jz .no_jump
    lodsw
    lea rsi, [bytecode_start + rax]
    jmp .run_loop
.no_jump:
    add rsi, 2            ; Skip offset
    jmp .run_loop

.alloc:
    ; 4-byte size
    lodsd
    mov rcx, rax
    call malloc
    push rax
    jmp .run_loop

.syscall:
    ; Win32 syscall via NTDLL
    lodsb
    xor eax, eax
    mov al, [rsi]
    inc rsi
    syscall
    jmp .run_loop

; Utility: int to string
int_to_str:
    ; Convert RAX to decimal string
    ; Output: RSI = ptr, RDI = length
    push rax
    push rcx
    push rdx
    push rbx
    
    mov rbx, 10
    lea rdi, [num_buf + 20]
    mov byte [rdi], 0
    mov rax, [rsp + 32]
    
    test rax, rax
    jns .positive
    neg rax
    
.positive:
    mov rcx, rax
    call .convert

    ; Add newline
    mov byte [rdi - 1], 10
    dec rdi
    mov rsi, rdi
    mov rdi, 21
    pop rbx
    pop rdx
    pop rcx
    pop rax
    ret

.convert:
    xor edx, edx
    div rbx
    add dl, '0'
    dec rdi
    mov [rdi], dl
    test rax, rax
    jnz .convert
    ret

; Heap management
malloc:
    push rdi
    push rsi
    mov rdi, qword [heap_ptr]
    add qword [heap_ptr], rcx
    mov rax, rdi
    pop rsi
    pop rdi
    ret

section .data
heap_size: dq 0x1000000    ; 16MB
heap_base: dq 0
heap_ptr: dq 0

; Import table
section .idata
kernel32_dll:
    db "KERNEL32.DLL", 0

functions:
    dd GetStdHandle
    dd WriteConsoleA
    dd ExitProcess
    dd 0

GetStdHandle:
    dw 0
    db "GetStdHandle", 0

WriteConsoleA:
    dw 0
    db "WriteConsoleA", 0

ExitProcess:
    dw 0
    db "ExitProcess", 0

; Nebulara bytecode for simple "print 42"
section .rdata
bytecode_start:
    db 0x01          ; PUSH_INT
    dq 42            ; Value
    db 0x04          ; PRINT
    db 0x0C          ; SYSCALL
    db 0x24          ; NtTerminateProcess

section .bss
stack_top: resq 0x10000
num_buf: resb 24

section .reloc