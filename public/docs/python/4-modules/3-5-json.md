---
id: python-modules-json
title: json
level: 3
---

### `json`

Web APIなどで広く使われているデータ形式であるJSONを扱うための機能を提供します。

```python-repl
>>> import json
>>> # Pythonの辞書型データ
>>> user = {"id": 1, "name": "Ken", "email": "ken@example.com"}
>>> # 辞書型をJSON形式の文字列に変換 (dumps: dump string)
>>> json_string = json.dumps(user, indent=2)
>>> print(json_string)
{
  "id": 1,
  "name": "Ken",
  "email": "ken@example.com"
}
>>> # JSON形式の文字列をPythonの辞書型に変換 (loads: load string)
>>> loaded_user = json.loads(json_string)
>>> loaded_user['name']
'Ken'
```

