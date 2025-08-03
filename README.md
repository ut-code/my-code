# my.code();

## インストール
```bash
npm ci
```

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

## 技術スタック・ドキュメント・メモ

- [Next.js](https://nextjs.org/docs)
    - 検索する際は「App Router」を含めることで古い記事に惑わされることが少なくなります。
- [DaisyUI](https://daisyui.com/docs/use/) / [Tailwind CSS](https://tailwindcss.com/docs)
    - buttonやinputやメニューなどの基本的なコンポーネントのデザインはDaisyUIにあるものを使うと楽です
    - 細かくスタイルを調整したい場合はTailwind CSSを使います (CSS直接指定(`style={{...}}`)よりもちょっと楽に書ける)
    - よくわからなかったらstyle直接指定でも良い
- [react-markdown](https://www.npmjs.com/package/react-markdown)
    - オプションがいろいろあり、今はほぼデフォルト設定で突っ込んでいるがあとでなんとかする
- [OpenNext](https://opennext.js.org/cloudflare)
