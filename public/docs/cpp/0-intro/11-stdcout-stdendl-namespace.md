---
id: cpp-intro-11-stdcout-stdendl-name
title: 'std::cout と std::endl - 名前空間 (namespace)'
level: 3
---

### `std::cout` と `std::endl` - 名前空間 (namespace)

  * `std::cout`: "character output stream" の略で、コンソールへの標準出力を担当します。
  * `<<`: **ストリーム挿入演算子**と呼ばれ、右側のデータを左側のストリーム（ここでは `std::cout`）に流し込むイメージです。
  * `std::endl`: "end line" の略で、改行を出力し、出力バッファをフラッシュ（強制的に出力）します。
  * `std::`: `cout` や `endl` が `std` という**名前空間 (namespace)** に属していることを示します。名前空間は、大規模なプログラムで関数や変数の名前が衝突するのを防ぐための仕組みです。`std` はC++の標準ライブラリが定義されている名前空間です。
