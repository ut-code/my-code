---
id: javascript-intro-browser
title: ブラウザでの実行 (参考)
level: 3
question:
  - なぜブラウザでJavaScriptを動かすにはHTMLファイルが必要なのですか？
  - alertとは何ですか？console.logとどう違うのですか？
---

### ブラウザでの実行 (参考)

ブラウザで動かす場合は、HTMLファイルが必要です。
`index.html` を作成し、以下のように記述してブラウザで開いてみてください。

```html
<!DOCTYPE html>
<html>
<body>
  <script>
    console.log("Hello from Browser!");
    alert("Hello from Browser!");
  </script>
</body>
</html>
```

ブラウザの開発者ツール（Consoleタブ）にメッセージが表示され、ポップアップウィンドウが出れば成功です。

my.code(); のチュートリアルでは主にJavaScriptの文法や基本的な機能を中心に扱います。
HTMLやCSSとあわせたウェブアプリケーション開発の基礎については [ut.code(); Learn](https://learn.utcode.net) で学ぶことができます。
