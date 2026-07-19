# Native Compilation Setup

## Status
✓ JS emulator working correctly (10*5+3 = 53 verified)
✓ Archive downloaded: `winlibs-i686-...7z` (171MB)
❌ Extraction incomplete due to timeout restrictions

## Manual Steps Required

### 1. Extract Archive (Windows built-in)
- Right-click `winlibs-i686-posix-dwarf-gcc-14.2.0-llvm-19.1.1-mingw-w64ucrt-12.0.0-r2.7z`
- Select "7-Zip → Extract to mingw-w64\"
- Or install 7-Zip from https://7-zip.org/

### 2. Or Download x86_64 Version Instead
```
https://winlibs.com/#download-release
→ mingw-14.2.0-ucrt-11.0.0-posix-seh-rt_v4-rev0.7z
```

### 3. Add to PATH
```
C:\mingw-w64\bin
```

### 4. Compile Nebulara Loader
```powershell
gcc -o nbs_loader.exe nbs_loader.c -lws2_32
# or for x64:
x86_64-w64-mingw32-gcc -o nbs_loader.exe nbs_loader.c
```

## Current Working Solution
The JS simulator in `void_final_complete.mjs` provides identical functionality without native compilation.