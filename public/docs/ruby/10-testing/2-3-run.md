---
id: ruby-testing-run
title: 3. テストの実行
level: 3
question:
  - テストを実行する際に、毎回ターミナルで `ruby test_calculator.rb` と入力するのですか？
  - 実行結果の `.` は、テストが成功したことを意味するとのことですが、具体的に何が成功したことを示しているのですか？
  - '`2 runs, 2 assertions` とありますが、runsとassertionsの違いは何ですか？'
---

### 3\. テストの実行

ターミナルで、作成した**テストファイル**を実行します。

```ruby-exec:test_calculator.rb
Run options: --seed 51740

# Running:

..

Finished in 0.001099s, 1819.8362 runs/s, 1819.8362 assertions/s.

2 runs, 2 assertions, 0 failures, 0 errors, 0 skips
```

実行結果のサマリに注目してください。

  * `.`（ドット）: テストが成功（Pass）したことを示します。
  * `2 runs, 2 assertions`: 2つのテスト（`test_addition` と `test_subtraction`）が実行され、合計2回のアサーション（`assert_equal`）が成功したことを意味します。
  * `0 failures, 0 errors`: 失敗もエラーもありません。

もしテストが失敗すると、`F`（Failure）や `E`（Error）が表示され、詳細なレポートが出力されます。
