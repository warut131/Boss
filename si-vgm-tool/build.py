#!/usr/bin/env python3
"""Inline vendor/jszip into src/app.html -> SI_VGM_Tool.html (single offline file)."""
from pathlib import Path
here = Path(__file__).parent
app = (here / "src/app.html").read_text(encoding="utf-8")
lib = (here / "vendor/jszip-3.10.1.min.js").read_text(encoding="utf-8")
(here / "SI_VGM_Tool.html").write_text(app.replace("/*JSZIP*/", lib, 1), encoding="utf-8")
print("built SI_VGM_Tool.html")
