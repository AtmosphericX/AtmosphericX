#!/bin/bash
set -e

PROJECT_DIR="$(cd "$(dirname "$0")/../project" && pwd)"
cd "$PROJECT_DIR"

npm run docs:build
npm run build