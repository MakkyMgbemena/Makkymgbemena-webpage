#!/usr/bin/env bash
# Regenerate public/sitemap.xml from the pages the build actually emits.
#
# Runs automatically as the "prebuild" step of npm run build. Run it by hand any time:
#   bash scripts/generate-sitemap.sh
#
# Rules:
#   - only pages listed in vite.config.mjs are included, so nothing unbuilt is advertised
#   - any page with a noindex robots tag is skipped
#   - lastmod is the file's real modification date, not a hard-coded one
#   - clean URLs, no .html
#   - changefreq is omitted; Google ignores it
set -euo pipefail
cd "$(dirname "$0")/.."

SITE="https://travelbunny.services"
OUT="public/sitemap.xml"

python3 - "$SITE" "$OUT" <<'INNER'
import glob, os, re, sys, time, xml.etree.ElementTree as ET

SITE, OUT = sys.argv[1], sys.argv[2]

# pages the build emits
cfg = open('vite.config.mjs', encoding='utf-8').read()
pages = re.findall(r"resolve\(__dirname,\s*'([^']+\.html)'\)", cfg)
if not pages:
    sys.exit('FAIL: no page inputs found in vite.config.mjs')

entries, skipped = [], []
for page in sorted(set(pages)):
    if not os.path.exists(page):
        skipped.append(f'{page} (missing)')
        continue
    s = open(page, encoding='utf-8').read()
    robots = re.search(r'<meta\s+name="robots"\s+content="([^"]*)"', s, re.I)
    if robots and 'noindex' in robots.group(1).lower():
        skipped.append(f'{page} (noindex)')
        continue
    slug = page[:-5]
    url = SITE + '/' if slug == 'index' else f'{SITE}/{slug}'
    lastmod = time.strftime('%Y-%m-%d', time.localtime(os.path.getmtime(page)))
    priority = '1.0' if slug == 'index' else ('0.8' if slug in
               ('bookkeeping', 'portfolio', 'about') else '0.7')
    entries.append((url, lastmod, priority))

ns = 'http://www.sitemaps.org/schemas/sitemap/0.9'
ET.register_namespace('', ns)
urlset = ET.Element(f'{{{ns}}}urlset')
for url, lastmod, priority in entries:
    u = ET.SubElement(urlset, f'{{{ns}}}url')
    ET.SubElement(u, f'{{{ns}}}loc').text = url
    ET.SubElement(u, f'{{{ns}}}lastmod').text = lastmod
    ET.SubElement(u, f'{{{ns}}}priority').text = priority

try:
    ET.indent(urlset, space='  ')          # Python 3.9+
except AttributeError:
    pass

os.makedirs(os.path.dirname(OUT), exist_ok=True)
ET.ElementTree(urlset).write(OUT, encoding='utf-8', xml_declaration=True)

# verify it parses and count
tree = ET.parse(OUT)
urls = [e.text for e in tree.getroot().iter(f'{{{ns}}}loc')]
if len(urls) != len(set(urls)):
    sys.exit('FAIL: duplicate URLs in the sitemap')
print(f'  sitemap: {len(urls)} url(s)')
for u in urls:
    print(f'    {u}')
for s in skipped:
    print(f'    skipped {s}')
INNER
