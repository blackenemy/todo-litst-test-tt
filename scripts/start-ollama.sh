#!/bin/zsh

# Detect OS
OS="$(uname -s)"

if [[ "$OS" == "Darwin" ]]; then
  # macOS
  if ! command -v ollama &>/dev/null; then
    echo "Ollama not found. Installing via Homebrew..."
    if ! command -v brew &>/dev/null; then
      echo "Error: Homebrew is required to auto-install Ollama."
      echo "Install Homebrew first: https://brew.sh"
      echo "Or install Ollama manually: https://ollama.com"
      exit 1
    fi
    brew install ollama
  fi

  if ! ollama list 2>/dev/null | grep -q "llama3.2"; then
    echo "Pulling llama3.2:latest (first-time setup, may take a few minutes)..."
    ollama pull llama3.2:latest
  fi

  ollama serve 2>/dev/null &
  echo "Ollama server started (macOS)."

elif [[ "$OS" == "Linux" ]]; then
  echo "Linux detected. Please install Ollama manually: https://ollama.com/download"
  exit 1
else
  # Assume Windows (run via Git Bash or WSL)
  if command -v ollama &>/dev/null; then
    echo "Ollama found."
  elif command -v where &>/dev/null && where ollama &>/dev/null; then
    echo "Ollama found."
  else
    echo "Ollama not found. Please install it from: https://ollama.com/download or via winget: winget install Ollama.Ollama"
    exit 1
  fi

  if ! ollama list 2>/dev/null | grep -q "llama3.2"; then
    echo "Pulling llama3.2:latest (first-time setup, may take a few minutes)..."
    ollama pull llama3.2:latest
  fi

  ollama serve 2>/dev/null &
  echo "Ollama server started (Windows)."
fi
