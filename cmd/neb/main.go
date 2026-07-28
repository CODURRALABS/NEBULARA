package main

import (
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
)

const version = "2.0.1"

func main() {
	if len(os.Args) > 1 && os.Args[1] == "--version" {
		fmt.Printf("nebulara %s\n", version)
		os.Exit(0)
	}

	binary := findBinary()
	if binary == "" {
		binary = buildBinary()
	}

	args := os.Args[1:]
	cmd := exec.Command(binary, args...)
	cmd.Stdin = os.Stdin
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr

	if err := cmd.Run(); err != nil {
		if exitErr, ok := err.(*exec.ExitError); ok {
			os.Exit(exitErr.ExitCode())
		}
		fmt.Fprintf(os.Stderr, "error: %v\n", err)
		os.Exit(1)
	}
}

func findBinary() string {
	name := "nebulara"
	if runtime.GOOS == "windows" {
		name += ".exe"
	}

	// Check same directory as binary
	if ex, err := os.Executable(); err == nil {
		dir := filepath.Dir(ex)
		candidate := filepath.Join(dir, name)
		if _, err := os.Stat(candidate); err == nil {
			return candidate
		}
	}

	// Check project root
	if _, err := os.Stat(name); err == nil {
		return name
	}

	// Check ~/.nebulara
	home, _ := os.UserHomeDir()
	candidate := filepath.Join(home, ".nebulara", name)
	if _, err := os.Stat(candidate); err == nil {
		return candidate
	}

	return ""
}

func buildBinary() string {
	exe := "nebulara"
	if runtime.GOOS == "windows" {
		exe += ".exe"
	}

	fmt.Fprintf(os.Stderr, "Building nebulara from source...\n")

	home, _ := os.UserHomeDir()
	buildDir := filepath.Join(home, ".nebulara")
	os.MkdirAll(buildDir, 0755)
	out := filepath.Join(buildDir, exe)

	src := "Compiler/nbs-bootstrap.c"
	if _, err := os.Stat(src); err != nil {
		// Try relative to module root
		src = filepath.Join(findModuleRoot(), "Compiler", "nbs-bootstrap.c")
	}

	flags := "-static -O2"
	if runtime.GOOS == "linux" {
		flags += " -static"
	}

	cmd := exec.Command("gcc", flags, src, "-o", out, "-lm")
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	if err := cmd.Run(); err != nil {
		fmt.Fprintf(os.Stderr, "Error: failed to build. Install gcc and try again.\n")
		os.Exit(1)
	}

	return out
}

func findModuleRoot() string {
	dir, _ := os.Getwd()
	for {
		if _, err := os.Stat(filepath.Join(dir, "go.mod")); err == nil {
			return dir
		}
		parent := filepath.Dir(dir)
		if parent == dir {
			break
		}
		dir = parent
	}
	return "."
}
