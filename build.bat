@echo off
REM Nebulara Compiler Build Script
REM Compiles the C runtime, transpilers, and test modules

echo ========================================
echo CODURRA NEBUXIA V2 - Nebulara Build
echo ========================================

set NBS_SRC=nebulara\Compiler\nbs-bootstrap.c
set NBS_OUT=nebulara\bin\nbsc.exe
set RUNTIME_SRC=nebulara\runtime\nbs_loader.c

echo [1/4] Building C runtime...
if not exist nebulara\bin mkdir nebulara\bin
gcc %RUNTIME_SRC% -o nebulara\bin\nbs_loader.dll -shared -O2
if errorlevel 1 (
    echo [ERROR] Failed to build nbs_loader.dll
    exit /b 1
)
echo [OK] nbs_loader.dll built

echo [2/4] Building Nebulara compiler...
gcc %NBS_SRC% -o %NBS_OUT% -O2 -municode
if errorlevel 1 (
    echo [ERROR] Failed to build nbsc.exe
    exit /b 1
)
echo [OK] nbsc.exe built

echo [3/4] Building Tauri FFI...
cd platform\tauri
cargo build --release
if errorlevel 1 (
    echo [ERROR] Failed to build Tauri FFI
    cd ..\..
    exit /b 1
)
cd ..\..
echo [OK] Tauri FFI built

echo [4/4] Running tests...
if exist nebulara\test\hello.nbs (
    %NBS_OUT% nebulara\test\hello.nbs -o nebulara\test\hello.exe
    if errorlevel 1 (
        echo [ERROR] Test compilation failed
        exit /b 1
    )
    echo [OK] Test passed
)

echo ========================================
echo Build Complete
echo ========================================
echo.
echo Usage:
echo   nebulara\bin\nbsc.exe input.nbs -o output.exe
echo.

pause
