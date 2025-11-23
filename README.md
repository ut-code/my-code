# my.code();

https://my-code.utcode.net

## インストール

```bash
npm ci
```

## 開発環境

```bash
npx prisma dev
```
を実行し、`t` キーを押して表示される DATABASE_URL をコピー

ルートディレクトリに .env.local という名前のファイルを作成し、以下の内容を記述
```dotenv
API_KEY=GeminiAPIキー
BETTER_AUTH_URL=http://localhost:3000
DATABASE_URL="postgres://... (prisma devの出力)"
```

別のターミナルで、
```bash
npx drizzle-kit migrate
```
でデータベースを初期化

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

* データベースのスキーマ(./app/schema/hoge.ts)を編集した場合、 `npx drizzle-kit generate` でmigrationファイルを作成し、 `npx drizzle-kit migrate` でデータベースに反映します。
    * また、mainにマージする際に本番環境のデータベースにもmigrateをする必要があります
* スキーマのファイルを追加した場合は app/lib/drizzle.ts でimportを追加する必要があります(たぶん)
* `npx prisma dev` で立ち上げたデータベースは `npx prisma dev ls` でデータベース名の確認・ `npx prisma dev rm default` で削除ができるらしい

### 本番環境の場合

上記の環境変数以外に、
* BETTER_AUTH_SECRET に任意の文字列
* GOOGLE_CLIENT_IDとGOOGLE_CLIENT_SECRETにGoogle OAuthのクライアントIDとシークレット https://www.better-auth.com/docs/authentication/google
* GITHUB_CLIENT_IDとGITHUB_CLIENT_SECRETにGitHub OAuthのクライアントIDとシークレット https://www.better-auth.com/docs/authentication/github

## ベースとなるドキュメントの作り方

- web版の ~~Gemini2.5Pro~~ Gemini3Pro を用いる。
- 以下のプロンプトで章立てを考えさせる
    > `n`章前後から構成される`言語名`のチュートリアルを書こうと思います。章立てを考えてください。`言語名`以外の言語でのプログラミングはある程度やったことがある人を対象にします。
    > 
- nを8, 10, 12, 15 など変えて何回か出力させ、それを統合していい感じの章立てを決める
- 実際にドキュメントを書かせる
    > 以下の内容で`言語名`チュートリアルの第`n`章を書いてください。他の言語でのプログラミングは経験がある人を対象にします。  
    > タイトルにはレベル1の見出し(#), それ以降の見出しにはレベル2以下(##)を使用してください。
    REPLで動作可能なコード例はスクリプトではなくREPLの実行例として書いてください。  
    > コード例はREPLの実行例では \`\`\``言語名`-repl 、ソースファイルの場合は \`\`\``言語名`:ファイル名`.拡張子` ではじまるコードブロックで示してください。ファイル名は被らないようにしてください。  
    > また、ファイルの場合は \`\`\``言語名`-exec:ファイル名`.拡張子` のコードブロック内に実行結果例を記載してください。  
    > また、最後には この章のまとめ セクションと、練習問題を2つほど書いてください。練習問題はこの章で学んだ内容を活用してコードを書かせるものにしてください。  
    >
    > 全体の構成  
    > `1. hoge`  
    > `2. fuga`  
    > `3. piyo`  
    > `4. ...`  
    >
    > `第n章: 第n章のタイトル`  
    > `第n章内の見出し・内容の概要…`  
    > 
- Gemini出力の調整
    - Canvasを使われた場合はやり直す。(Canvasはファイル名付きコードブロックで壊れる)
    - 箇条書きの最後に `<!-- end list -->` と出力される場合がある。消す
    - 太字がなぜか `**キーワード**` の代わりに `\*\*キーワード\*\*` となっている場合がある。 `\*\*` → `**` の置き換えで対応
    - 見出しの前に `-----` (水平線)が入る場合がある。my.code();は水平線の表示に対応しているが、消す方向で統一
    - `言語名-repl` にはページ内で一意なIDを追加する (例: `言語名-repl:1`)
    - 練習問題の見出しは「この章のまとめ」の直下のレベル3見出しで、 `### 練習問題n` または `### 練習問題n: タイトル` とする
    - 練習問題のファイル名は不都合がなければ `practice(章番号)_(問題番号).拡張子` で統一。空でもよいのでファイルコードブロックとexecコードブロックを置く
- 1章にはたぶん練習問題要らない。

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
