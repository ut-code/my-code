---
id: rust-modules-usage
title: コードでの利用
level: 3
question:
  - 標準ライブラリ（`std`）が「外部クレートのような扱い」というのはどういう意味ですか？
  - オンライン実行環境で外部クレートが使えないのはなぜですか？
  - 外部クレートを使うには、`Cargo.toml`に追加するのと`use`するのと両方が必要なのですか？
---

### コードでの利用

外部クレートも、プロジェクト内のモジュールと同じように `use` でスコープに持ち込んで使用します。

```rust
use std::collections::HashMap; // 標準ライブラリも 'std' という外部クレートのような扱い

// 外部クレート rand を使用する想定のコード
use rand::Rng;

fn main() {
    let mut scores = HashMap::new();
    scores.insert("Blue", 10);
    scores.insert("Yellow", 50);

    println!("スコア: {:?}", scores);
    
    let secret_number = rand::thread_rng().gen_range(1..101);
    println!("乱数: {}", secret_number);
}
```

標準ライブラリ（`std`）はデフォルトで利用可能ですが、それ以外のクレートは crates.io （Rustの公式パッケージレジストリ）から自動的にダウンロード・ビルドされます。

> 注: my.code(); のオンライン実行環境では外部クレートは使用できません。
