"""Export the current website using its print stylesheet (no duplicate content).

Prerequisites: Node, playwright-core, Chrome, and a local static server.
See README.md for commands. Environment variables are forwarded to Node.
"""
from pathlib import Path
import subprocess

if __name__ == '__main__':
    subprocess.run(['node', 'scripts/export-pdf.cjs'], cwd=Path(__file__).resolve().parent, check=True)
