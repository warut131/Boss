#!/usr/bin/env python3
"""Build single offline HTML files from src/app.html.

SI_VGM_Tool.html       - generic: user drops Booking + Template
SI_VGM_Tool_SRAU.html  - also has SHINKI_SRAU_VGM_SI_TEMPLATE_BLANK.xlsx built in,
                         so only the Booking is needed (built only if that file exists;
                         git-ignored because it contains customer addresses)
"""
import base64, json
from pathlib import Path
here = Path(__file__).parent
app = (here / "src/app.html").read_text(encoding="utf-8")
lib = (here / "vendor/jszip-3.10.1.min.js").read_text(encoding="utf-8")
app = app.replace("/*JSZIP*/", lib, 1)
(here / "SI_VGM_Tool.html").write_text(app, encoding="utf-8")
print("built SI_VGM_Tool.html")
tpl = here / "SHINKI_SRAU_VGM_SI_TEMPLATE_BLANK.xlsx"
if tpl.exists():
    data = json.dumps({"name": tpl.name, "data": base64.b64encode(tpl.read_bytes()).decode()})
    (here / "SI_VGM_Tool_SRAU.html").write_text(app.replace("/*TPL*/null", data, 1), encoding="utf-8")
    print("built SI_VGM_Tool_SRAU.html")
