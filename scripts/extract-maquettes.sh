#!/usr/bin/env bash
# Régénère les références visuelles à partir de docs/maquettes.pdf (non versionné).
# Prérequis : poppler (pdftoppm, pdftotext, pdfimages).
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p docs/screens docs/images
pdftoppm -png -r 110 docs/maquettes.pdf docs/screens/page
pdftotext -layout docs/maquettes.pdf docs/maquettes.txt
pdfimages -png -p docs/maquettes.pdf docs/images/img
echo "OK : docs/screens (pages), docs/images (images brutes)."
