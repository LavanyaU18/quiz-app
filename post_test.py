import json
from urllib.request import Request, urlopen

url = 'http://127.0.0.1:5000/submit'
data = json.dumps({"answers":[{"id":1,"answer":"Paris"},{"id":2,"answer":"4"}]}).encode('utf-8')
req = Request(url, data=data, headers={'Content-Type':'application/json'})
with urlopen(req) as resp:
    body = resp.read().decode('utf-8')
    print(body)
