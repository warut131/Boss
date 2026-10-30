#!/usr/bin/env python3
"""Make a blank SI/VGM template from a filled one (job data cleared, layout/formulas kept).
Usage: python3 make_blank_template.py filled.xlsx blank.xlsx"""
import re, sys, zipfile
src, dst = sys.argv[1], sys.argv[2]
CLEAR = {
 "xl/worksheets/sheet1.xml": ["J2","D25","D28","A28","A31","D31","D38","D39","J39","K39","E41","C58"],   # SI DATA
 "xl/worksheets/sheet2.xml": [f"{c}{r}" for r in range(12,27) for c in "BCG"],                          # VGM
 "xl/worksheets/sheet3.xml": [f"{c}{r}" for r in range(6,31) for c in "BCDFHJ"],                        # ATTACH
}
# show blank instead of 0 / 1900-01-00 when the referenced cell is empty
FORMULAS = {
 "xl/worksheets/sheet1.xml": [("A28",)*2, ("D28",)*2],
 "xl/worksheets/sheet2.xml": [("'ATTACH SHEET (WHEN REQUIRED)'!I1",)*2, ("B12",)*2],
 "xl/worksheets/sheet3.xml": [("'SI DATA'!J2",)*2],
}
def blank_cell(xml, ref):
    pat = re.compile(r'<c r="%s"((?:\s+[a-z:]+="[^"]*")*)\s*(?:/>|>.*?</c>)' % ref, re.S)
    def rep(m):
        s = re.search(r'\ss="\d+"', m.group(1))
        return '<c r="%s"%s/>' % (ref, s.group(0) if s else "")
    return pat.sub(rep, xml, count=1)
def drop_cached(xml):  # formula cells: keep formula, drop stale cached value
    return re.sub(r'(<c r="[A-Z]+\d+"[^>]*?)(?:\s+t="(?:str|n|b|e)")?([^>]*>)(<f[^>]*?(?:/>|>.*?</f>))<v>.*?</v>',
                  r'\1\2\3', xml, flags=re.S)
zin = zipfile.ZipFile(src)
with zipfile.ZipFile(dst, "w", zipfile.ZIP_DEFLATED) as zout:
    for item in zin.infolist():
        name = item.filename
        if name == "xl/calcChain.xml": continue
        data = zin.read(name)
        if name in CLEAR or name.startswith("xl/worksheets/sheet"):
            x = data.decode("utf-8")
            for ref in CLEAR.get(name, []): x = blank_cell(x, ref)
            for old, ref in FORMULAS.get(name, []):
                x = x.replace("<f>%s</f>" % old, '<f>IF(%s="","",%s)</f>' % (ref, ref), 1)
            data = drop_cached(x).encode("utf-8")
        elif name == "xl/_rels/workbook.xml.rels":
            data = re.sub(rb'<Relationship [^>]*calcChain[^>]*/>', b"", data)
        elif name == "[Content_Types].xml":
            data = re.sub(rb'<Override [^>]*calcChain[^>]*/>', b"", data)
        elif name == "xl/workbook.xml":
            data = re.sub(rb'<calcPr([^>]*?)\s*/>', rb'<calcPr\1 fullCalcOnLoad="1"/>', data)
        zout.writestr(item, data)
print("ok")
