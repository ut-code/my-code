[[Dart]] 3.0では、ライブラリの作者がクラスの継承・実装・インスタンス化の権限をきめ細かく制御できるように、**[[クラス修飾子]]（Class Modifiers）** が導入されました。

特に **`sealed` クラス** は、RustのEnumやKotlinのSealed Class、TypeScriptのTagged Union（判別可能なUnion型）に相当する **[[代数的データ型]]（ADT）** をDartで美しく実現し、`switch` 式と組み合わせることで網羅性チェックの恩恵を最大限に引き出します。

この章では、`sealed`, `base`, `interface`, `final` 修飾子の役割と、堅牢なドメインモデル設計を学びます。
