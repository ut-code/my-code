---
id: typescript-types-5-unknown
title: 'unknown: 安全な「正体不明」'
level: 3
---

### unknown: 安全な「正体不明」

「何が入ってくるかわからない」場合（例：外部APIのレスポンスなど）は、`any`の代わりに`unknown`を使います。`unknown`型の変数は、**「型の絞り込み（Type Narrowing）」を行わない限り、プロパティへのアクセスやメソッドの呼び出しができません**。
