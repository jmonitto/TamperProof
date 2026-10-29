import json,time,urllib.request,html,os
from html.parser import HTMLParser
from urllib.parse import urljoin
from pathlib import Path
base='https://www.tamperproof.com'
categories=['/products-scs/phillips_security','/products-scs/socket_security','/products-scs/snake_eyes_spanner','/products-scs/torx_security','/products-scs/nuts','/products-scs/tri_wing','/products-scs/torx','/products-scs/opsit','/products-scs/one-way-scs','/products-scs/One-Way-Sex-Bolt','/products-scs/tp3','/products-scs/tools-kits','/products-scs/tools-kits?page=2']
class Parser(HTMLParser):
 def __init__(self): super().__init__();self.current=None;self.products=[];self.description='';self.title=''
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag=='meta' and (a.get('name','').lower()=='description' or a.get('property','').lower()=='og:description') and a.get('content'): self.description=a['content']
  if tag=='a' and 'facets-item-cell-grid-title' in a.get('class','').split(): self.current={'url':urljoin(base,a.get('href','')),'title':''}
 def handle_data(self,data):
  if self.current is not None: self.current['title']+=data
 def handle_endtag(self,tag):
  if tag=='a' and self.current is not None:
   self.current['title']=' '.join(self.current['title'].split())
   if self.current['title'] and self.current['url'].startswith(base+'/'): self.products.append(self.current)
   self.current=None
records=[]
for idx,path in enumerate(categories):
 try:
  time.sleep(20)
  req=urllib.request.Request(base+path,headers={'User-Agent':'TamperproofDemoResearch/1.0 (public customer service demo)'})
  with urllib.request.urlopen(req,timeout=35) as r: raw=r.read().decode('utf-8','replace')
  parser=Parser();parser.feed(raw)
  # These listings conflict with their descriptions or destination URLs; exclude them.
  if path == '/products-scs/opsit': parser.products=[]
  parser.products=[p for p in parser.products if not ('Un-Do-It' in p['title'] and '1/4' in p['title'] and p['url'].endswith('/un-do-it-one-way-removal-tools-6-8'))]
  for product in parser.products: product['title']=product['title'].replace('\ufffd','')
  records.append({'category_url':base+path.split('?')[0],'description':parser.description,'products':parser.products})
  print(f'{path}: {len(parser.products)} products',flush=True)
 except Exception as e:
  records.append({'category_url':base+path.split('?')[0],'error':str(e),'products':[]});print(f'{path}: FAILED {e}',flush=True)
 Path('catalog.json').write_text(json.dumps(records,indent=2,ensure_ascii=False),encoding='utf-8')

