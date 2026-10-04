import urllib.request,concurrent.futures,re,json,html,base64,os
root=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.makedirs(root+'/docs',exist_ok=True)
s=open(root+'/src/catalog.ts').read();ids=re.findall(r"\['[^']+','([a-zA-Z0-9]{22})'",s)
def f(id):
 url='https://open.spotify.com/track/'+id
 try:
  data=urllib.request.urlopen(url,timeout=30).read().decode()
  name=re.search(r'<meta property="og:title" content="(.*?)"',data)
  description=re.search(r'<meta property="og:description" content="(.*?)"',data)
  return {'id':id,'source':url,'checkedAt':'2026-10-04','httpStatus':200,'title':html.unescape(name.group(1)) if name else None,'description':html.unescape(description.group(1)) if description else None,'audioVerified':False,'finlandPlaybackVerified':False}
 except Exception as e:return {'id':id,'error':str(e)}
with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
 result=list(pool.map(f,ids))
open(root+'/docs/spotify-verification.json','w').write(json.dumps(result,ensure_ascii=False,indent=2))
for r in result:print(json.dumps(r,ensure_ascii=False))
