#!/usr/bin/env python3
# Usage: python3 audit_xlsx.py template.xlsx output.xlsx
"""Compare an output workbook with its source template, part by part and cell by cell."""
import sys, zipfile, re
import xml.etree.ElementTree as ET
M = "{http://schemas.openxmlformats.org/spreadsheetml/2006/main}"
a_path, b_path = sys.argv[1], sys.argv[2]
A, B = zipfile.ZipFile(a_path), zipfile.ZipFile(b_path)
an, bn = set(A.namelist()), set(B.namelist())
print("== parts only in template:", sorted(an - bn)); print("== parts only in output:", sorted(bn - an))
sheets = [n for n in an & bn if re.match(r"xl/worksheets/sheet\d+\.xml$", n)]
for n in sorted(an & bn):
    if n in sheets: continue
    if A.read(n) != B.read(n): print("== part changed:", n)

def sst(z):
    if "xl/sharedStrings.xml" not in z.namelist(): return []
    r = ET.fromstring(z.read("xl/sharedStrings.xml"))
    return ["".join(t.text or "" for t in si.iter(M+"t")) for si in r.iter(M+"si")]
sa, sb = sst(A), sst(B)
def cells(z, n, ss):
    root = ET.fromstring(z.read(n)); out = {}
    for c in root.iter(M+"c"):
        t = c.get("t"); v = c.find(M+"v"); f = c.find(M+"f")
        if t == "inlineStr": val = "".join(x.text or "" for x in c.iter(M+"t"))
        elif v is None: val = None
        elif t == "s": val = ss[int(v.text)]
        elif t in ("str","e"): val = v.text or ""
        else: val = float(v.text)
        out[c.get("r")] = dict(s=c.get("s") or "0", val=val, f=(f.text if f is not None else None), fshared=(f.get("t")=="shared" if f is not None else False))
    rows = {r.get("r"): {k:v for k,v in r.attrib.items() if k not in ("spans",) and not k.startswith("{")} for r in root.iter(M+"row")}
    other = []
    for child in root:
        if child.tag != M+"sheetData": other.append(ET.tostring(child))
    return out, rows, other, root
names = {}
wb = ET.fromstring(A.read("xl/workbook.xml"))
rels = ET.fromstring(A.read("xl/_rels/workbook.xml.rels"))
tgt = {r.get("Id"): "xl/"+r.get("Target") for r in rels}
for s in wb.iter(M+"sheet"): names[tgt[s.get("{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id")]] = s.get("name")
for n in sorted(sheets):
    ca, ra, oa, _ = cells(A, n, sa); cb, rb, ob, _ = cells(B, n, sb)
    print(f"\n######## sheet '{names[n]}' ({n})")
    print("  non-cell parts (cols, merges, page setup, views, margins...):", "IDENTICAL" if [re.sub(rb' xmlns(:\w+)?="[^"]*"', b"", x) for x in oa]==[re.sub(rb' xmlns(:\w+)?="[^"]*"', b"", x) for x in ob] else "DIFFERENT")
    if oa != ob:
        for x,y in zip(oa,ob):
            if re.sub(rb' xmlns(:\w+)?="[^"]*"', b"", x)!=re.sub(rb' xmlns(:\w+)?="[^"]*"', b"", y): print("   A:",x[:200]); print("   B:",y[:200])
    print("  row attributes (heights/hidden/styles):", "IDENTICAL" if ra==rb else f"DIFFERENT {[(k,ra.get(k),rb.get(k)) for k in set(ra)|set(rb) if ra.get(k)!=rb.get(k)][:10]}")
    print("  cells missing in output:", sorted(set(ca)-set(cb)), "| cells added:", sorted(set(cb)-set(ca)))
    sty = [r for r in ca if r in cb and ca[r]["s"] != cb[r]["s"]]
    print("  cells whose style (font/border/fill/format) changed:", sty or "NONE")
    fch = [(r, ca[r]["f"], cb[r]["f"]) for r in ca if r in cb and ca[r]["f"] != cb[r]["f"] and not (ca[r]["fshared"] and ca[r]["f"] is None)]
    print("  formulas changed:", fch or "NONE")
    vch = [(r, ca[r]["val"], cb[r]["val"]) for r in ca if r in cb and ca[r]["val"] != cb[r]["val"] and ca[r]["f"] is None and cb[r]["f"] is None]
    print(f"  literal values changed ({len(vch)}):")
    for r,x,y in sorted(vch, key=lambda t:(int(re.sub(r'\D','',t[0])), t[0])): print(f"     {r:5} {x!r:55} -> {y!r}")
