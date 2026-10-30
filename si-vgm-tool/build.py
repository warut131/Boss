#!/usr/bin/env python3
"""Build single offline HTML files from src/app.html.

SI_VGM_Tool.html       - generic: user drops Booking + Template
SI_VGM_Tool_SRAU.html  - also has SHINKI_SRAU_VGM_SI_TEMPLATE_BLANK.xlsx built in,
                         so only the Booking is needed (built only if that file exists;
                         git-ignored because it contains customer addresses)
"""
import base64, gzip, json
from pathlib import Path
here = Path(__file__).parent
app = (here / "src/app.html").read_text(encoding="utf-8")
lib = (here / "vendor/jszip-3.10.1.min.js").read_text(encoding="utf-8")
app = app.replace("/*JSZIP*/", lib, 1)
# PDF.js + Tesseract OCR for the PDF cross-check, stored gzip+base64 and unpacked only when a PDF is dropped
PDF_LIBS = [("lib-pdfjs", "pdfjs-3.11.174.min.js"), ("lib-pdfjs-worker", "pdfjs-3.11.174.worker.min.js"),
            ("lib-tess", "tesseract-5.1.1.min.js"), ("lib-tess-worker", "tesseract-5.1.1.worker.min.js"),
            ("lib-tess-core", "tesseract-core-5.1.1-simd-lstm.wasm.js"), ("lib-eng", "eng-4.0.0_best_int.traineddata.gz")]
def lib_tag(id, name):
    raw = (here / "vendor" / name).read_bytes()
    gz = not name.endswith(".gz")  # the traineddata is already gzipped; the OCR worker unzips it itself
    data = gzip.compress(raw, 9, mtime=0) if gz else raw
    attr = ' data-gz="1"' if gz else ""
    return f'<script type="text/plain" id="{id}"{attr}>{base64.b64encode(data).decode()}</script>'
app = app.replace("<!--PDFLIBS-->", "\n".join(lib_tag(*l) for l in PDF_LIBS), 1)
(here / "SI_VGM_Tool.html").write_text(app, encoding="utf-8")
print("built SI_VGM_Tool.html")
tpl = here / "SHINKI_SRAU_VGM_SI_TEMPLATE_BLANK.xlsx"
if tpl.exists():
    data = json.dumps({"name": tpl.name, "data": base64.b64encode(tpl.read_bytes()).decode()})
    (here / "SI_VGM_Tool_SRAU.html").write_text(app.replace("/*TPL*/null", data, 1), encoding="utf-8")
    print("built SI_VGM_Tool_SRAU.html")
