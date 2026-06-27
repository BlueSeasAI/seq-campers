# -*- coding: utf-8 -*-
# Broken internal-link checker for the built Astro site (dist/).
# Crawls every dist/**/*.html, extracts href/src/action, and verifies each
# internal target resolves to a real file. Reports broken links + any links
# still pointing at the renamed /quote/kruiser-t.
import os, re, glob, sys
from urllib.parse import urldefrag, urlparse

DIST = 'dist'
html_files = glob.glob(os.path.join(DIST, '**', '*.html'), recursive=True)

ATTR = re.compile(r'(?:href|action)\s*=\s*"([^"]*)"')

def resolve(link, from_file):
    # strip fragment + query
    link, _ = urldefrag(link)
    link = link.split('?', 1)[0]
    if not link:
        return None  # pure fragment/query - skip
    p = urlparse(link)
    if p.scheme or link.startswith('//') or link.startswith('mailto:') or link.startswith('tel:') or link.startswith('javascript:'):
        return None  # external - skip
    # make absolute path within site
    if link.startswith('/'):
        rel = link.lstrip('/')
    else:
        base = os.path.dirname(os.path.relpath(from_file, DIST))
        rel = os.path.normpath(os.path.join(base, link)).replace('\\', '/')
    # candidate files
    cands = []
    if rel.endswith('/'):
        cands.append(rel + 'index.html')
    elif os.path.splitext(rel)[1]:
        cands.append(rel)
    else:
        cands += [rel + '/index.html', rel + '.html', rel]
    for c in cands:
        if os.path.exists(os.path.join(DIST, c)):
            return True
    return cands  # broken -> return the candidates we tried

broken = []
kruiser_t_refs = []
total_links = 0
for f in html_files:
    txt = open(f, encoding='utf-8').read()
    for m in ATTR.finditer(txt):
        link = m.group(1)
        if '/quote/kruiser-t' in link:
            kruiser_t_refs.append((os.path.relpath(f, DIST), link))
        r = resolve(link, f)
        if r is None:
            continue
        total_links += 1
        if r is not True:
            broken.append((os.path.relpath(f, DIST), link))

print(f"Scanned {len(html_files)} HTML pages, {total_links} internal links.\n")
if kruiser_t_refs:
    print(f"!! {len(kruiser_t_refs)} link(s) still point to /quote/kruiser-t (should be /quote/kruiser):")
    for src, l in kruiser_t_refs:
        print(f"   {src:45s} -> {l}")
    print()
else:
    print("OK: no internal links point to the old /quote/kruiser-t.\n")

if broken:
    print(f"!! {len(broken)} BROKEN internal link(s):")
    seen = set()
    for src, l in broken:
        key = (src, l)
        if key in seen: continue
        seen.add(key)
        print(f"   {src:45s} -> {l}")
    sys.exit(1)
else:
    print("OK: every internal link resolves to a real page. No broken links.")
