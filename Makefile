# Makefile for Nebulara
# Simple build for Windows x64

CC = gcc
CFLAGS = -municode -O2 -Wall

all: nebulara.exe

nebulara.exe: Compiler/nbs-bootstrap.c
	$(CC) $(CFLAGS) $< -o $@

test: nebulara.exe
	copy test\hello.nbs in.nbs 2>nul
	nebulara.exe in.nbs out.exe
	out.exe

clean:
	del /q *.exe 2>nul
	del /q bin\*.exe 2>nul

.PHONY: all test clean