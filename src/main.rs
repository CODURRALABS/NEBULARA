use std::process::Command;
use std::path::PathBuf;
use std::env;

const VERSION: &str = "1.2.0";

fn main() {
    let args: Vec<String> = env::args().skip(1).collect();

    if args.iter().any(|a| a == "--version") {
        println!("nebulara {}", VERSION);
        return;
    }

    let binary = find_or_build();
    let status = Command::new(&binary)
        .args(&args)
        .status()
        .expect("failed to execute nebulara");

    std::process::exit(status.code().unwrap_or(1));
}

fn find_or_build() -> PathBuf {
    // Check if the C source exists (cargo install from repo)
    let src = PathBuf::from("Compiler/nbs-bootstrap.c");
    if !src.exists() {
        // Fallback: just try to run nebulara directly
        return PathBuf::from("nebulara");
    }

    let out_dir = dirs().join("nebulara");
    std::fs::create_dir_all(&out_dir).ok();
    let binary = out_dir.join(if cfg!(windows) { "nebulara.exe" } else { "nebulara" });

    if !binary.exists() {
        eprintln!("Building nebulara...");
        let status = Command::new("gcc")
            .args(["-static", "-O2", "Compiler/nbs-bootstrap.c"])
            .args(["-o"]).arg(&binary)
            .args(["-lm"])
            .status()
            .expect("failed to build: install gcc");
        if !status.success() {
            std::process::exit(1);
        }
    }

    binary
}

fn dirs() -> PathBuf {
    if cfg!(windows) {
        PathBuf::from(env::var("LOCALAPPDATA").unwrap_or_else(|_| ".".into()))
            .join("nebulara")
    } else {
        PathBuf::from(env::var("HOME").unwrap_or_else(|_| ".".into()))
            .join(".nebulara")
    }
}
