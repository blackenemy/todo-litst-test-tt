#!/bin/zsh

# Install Ollama if not present
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

# Pull model if not already available
if ! ollama list 2>/dev/null | grep -q "llama3.2"; then
  echo "Pulling llama3.2:latest (first-time setup, may take a few minutes)..."
  ollama pull llama3.2:latest
fi

# Start Ollama in background (no-op if already running)
ollama serve 2>/dev/null &
