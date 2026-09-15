[[Dart]]はバージョン2.12より **健全なNull Safety（Sound Null Safety）** を言語レベルで導入しました。

現代のプログラミングにおいて、`NullPointerException`（Null参照エラー）は最も頻発するバグの1つです。
Dartの健全な[[Null Safety]]は、コードを書いている最中やコンパイル時にNullになり得る箇所を厳密に区別し、実行時クラッシュを未然に防ぎます。

この章では、DartのNull Safetyの仕組み、各種Null認識演算子、そして `late` 修飾子の正しい使い方をマスターします。
