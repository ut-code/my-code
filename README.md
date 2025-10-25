# my.code();

https://my-code.utcode.net

## インストール
```bash
npm ci
npx prisma generate
```

ルートディレクトリに .env.local という名前のファイルを作成し、以下の内容を記述
```dotenv
API_KEY=GeminiAPIキー
BETTER_AUTH_URL=http://localhost:3000
```

prismaの開発環境を起動
(.env にDATABASE_URLが自動的に追加される)
```bash
npx prisma dev
```
別ターミナルで
```bash
npx prisma db push
```

### 本番環境の場合

上記の環境変数以外に、
* BETTER_AUTH_SECRET に任意の文字列
* DATABASE_URL に本番用のPostgreSQLデータベースURL
* GOOGLE_CLIENT_IDとGOOGLE_CLIENT_SECRETにGoogle OAuthのクライアントIDとシークレット https://www.better-auth.com/docs/authentication/google
* GITHUB_CLIENT_IDとGITHUB_CLIENT_SECRETにGitHub OAuthのクライアントIDとシークレット https://www.better-auth.com/docs/authentication/github


## 開発環境

```bash
npm run dev
```
[http://localhost:3000](http://localhost:3000) で開きます。

```bash
npm run format
```
でコードを整形します。

```bash
npm run lint
```
でコードをチェックします。出てくるwarningやerrorはできるだけ直しましょう。

## markdown仕様

````
```言語名-repl
>>> コマンド
実行結果例
```
````

でターミナルを埋め込む。
* ターミナル表示部は app/terminal/terminal.tsx
* コマンド入力処理は app/terminal/repl.tsx
* 各言語の実行環境は app/terminal/言語名/ 内に書く。
* 実行結果はSectionContextにも送られ、section.tsxからアクセスできる

````
```言語名:ファイル名
ファイルの内容
```
````

でテキストエディターを埋め込む。
* app/terminal/editor.tsx
* editor.tsx内で `import "ace-builds/src-min-noconflict/mode-言語名";` を追加すればその言語に対応した色付けがされる。
    * importできる言語の一覧は https://github.com/ajaxorg/ace-builds/tree/master/src-noconflict
* 編集した内容は app/terminal/file.tsx のFileContextで管理される。
    * 編集中のコードはFileContextに即時送られる
    * FileContextが書き換えられたら即時すべてのエディターに反映される
* 編集したファイルの一覧はSectionContextにも送られ、section.tsxからアクセスできる

````
```言語名-readonly:ファイル名
ファイルの内容
```
````

で同様にテキストエディターを埋め込むが、編集不可になる

````
```言語名-exec:ファイル名
実行結果例
```
````

で実行ボタンを表示する
* 実行ボタンを押した際にFileContextからファイルを読み、実行し、結果を表示する
* app/terminal/exec.tsx に各言語ごとの実装を書く (それぞれ app/terminal/言語名/ 内に定義した関数を呼び出す)
* 実行結果はSectionContextにも送られ、section.tsxからアクセスできる


## 技術スタック・ドキュメント・メモ

- [Next.js](https://nextjs.org/docs)
    - 検索する際は「App Router」を含めることで古い記事に惑わされることが少なくなります。
- [OpenNext](https://opennext.js.org/cloudflare)
- [DaisyUI](https://daisyui.com/docs/use/) / [Tailwind CSS](https://tailwindcss.com/docs)
    - buttonやinputやメニューなどの基本的なコンポーネントのデザインはDaisyUIにあるものを使うと楽です
    - 細かくスタイルを調整したい場合はTailwind CSSを使います (CSS直接指定(`style={{...}}`)よりもちょっと楽に書ける)
    - よくわからなかったらstyle直接指定でも良い
- [SWR](https://swr.vercel.app/ja)
- [react-markdown](https://www.npmjs.com/package/react-markdown)
- REPL・実行結果表示: [xterm.js](https://xtermjs.org/)
- コードエディター: [react-ace](https://github.com/securingsincity/react-ace)
- それ以外のコードブロック: [react-syntax-highlighter](https://github.com/react-syntax-highlighter/react-syntax-highlighter)
