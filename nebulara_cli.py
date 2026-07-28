#!/usr/bin/env python3
"""Nebulara language CLI - wraps the native interpreter."""
import os
import sys
import subprocess
import platform
import urllib.request
import zipfile
import tempfile

__version__ = "2.0.1"

REPO = "https://github.com/CODURRALABS/NEBULARA"

def _binary_name():
    return "nebulara.exe" if platform.system() == "Windows" else "nebulara"

def _find_binary():
    # Check same directory as this script
    script_dir = os.path.dirname(os.path.abspath(__file__))
    candidate = os.path.join(script_dir, _binary_name())
    if os.path.isfile(candidate):
        return candidate

    # Check PATH
    for d in os.environ.get("PATH", "").split(os.pathsep):
        candidate = os.path.join(d, _binary_name())
        if os.path.isfile(candidate):
            return candidate

    # Check user install dir
    user_dir = os.path.join(os.path.expanduser("~"), ".nebulara")
    candidate = os.path.join(user_dir, _binary_name())
    if os.path.isfile(candidate):
        return candidate

    return None

def _download_binary():
    system = platform.system().lower()
    machine = platform.machine().lower()
    tag = f"v{__version__}"

    if system == "windows":
        asset = f"nebulara-{tag}-win-x64.zip"
    elif system == "darwin":
        asset = f"nebulara-{tag}-macos-x64.tar.gz"
    else:
        asset = f"nebulara-{tag}-linux-x64.tar.gz"

    url = f"{REPO}/releases/download/{tag}/{asset}"
    user_dir = os.path.join(os.path.expanduser("~"), ".nebulara")
    os.makedirs(user_dir, exist_ok=True)
    dest = os.path.join(user_dir, _binary_name())

    if os.path.isfile(dest):
        return dest

    print(f"Downloading nebulara {tag}...", file=sys.stderr)
    try:
        urllib.request.urlretrieve(url, os.path.join(user_dir, asset))
    except Exception as e:
        print(f"Error: Could not download {url}: {e}", file=sys.stderr)
        print(f"Install manually from {REPO}/releases", file=sys.stderr)
        sys.exit(1)

    archive = os.path.join(user_dir, asset)
    if asset.endswith(".zip"):
        with zipfile.ZipFile(archive, 'r') as z:
            z.extractall(user_dir)
    else:
        subprocess.run(["tar", "xzf", archive, "-C", user_dir], check=True)
    os.remove(archive)

    if not os.path.isfile(dest):
        print(f"Error: binary not found after download", file=sys.stderr)
        sys.exit(1)

    return dest

def cli():
    binary = _find_binary()
    if not binary:
        try:
            binary = _download_binary()
        except Exception:
            print("Error: nebulara binary not found.", file=sys.stderr)
            print(f"Build from source: gcc -static -O2 Compiler/nbs-bootstrap.c -o nebulara -lm", file=sys.stderr)
            print(f"Or download from {REPO}/releases", file=sys.stderr)
            sys.exit(1)

    args = sys.argv[1:]

    # Pass std lib path if running a file
    if args and not args[0].startswith("-"):
        std_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "std")
        if os.path.isdir(std_dir):
            os.environ["NEB_STDLIB"] = std_dir

    result = subprocess.run([binary] + args)
    sys.exit(result.returncode)

if __name__ == "__main__":
    cli()
