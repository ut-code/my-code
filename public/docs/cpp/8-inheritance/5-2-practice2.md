---
id: cpp-inheritance-practice2
title: '問題2: 従業員の給与計算'
level: 3
question:
  - '`Employee` クラスで `calculate_salary()` を純粋仮想関数にする意味は何ですか？'
  - >-
    `FullTimeEmployee` や `PartTimeEmployee` で `get_name()`
    のような関数は必要ですか？どこで定義するのが良いですか？
  - '`main` 関数の `full_time_emp.get_name()` の部分はどのように実装すればいいですか？'
---

### 問題2: 従業員の給与計算

`Employee` という[[抽象クラス]]を定義してください。このクラスは、従業員の名前を保持し、給与を計算するための[[純粋仮想関数]] `calculate_salary()` を持ちます。

次に、`Employee` を継承して、`FullTimeEmployee`（月給制）と `PartTimeEmployee`（時給制）の2つの[[クラス]]を作成します。それぞれのクラスで `calculate_salary()` を具体的に実装してください。

[[`main` 関数]]で、それぞれのクラスの[[インスタンス]]を作成し、給与が正しく計算されることを確認してください。

```cpp:practice9_2.cpp
#include <iostream>
#include <string>

// ここに Employee, FullTimeEmployee, PartTimeEmployee クラスを定義してください


int main() {
    FullTimeEmployee full_time_emp("Alice", 3000); // 月給3000ドル
    PartTimeEmployee part_time_emp("Bob", 20, 80); // 時給20ドル、80時間勤務

    std::cout << full_time_emp.get_name() << "'s Salary: $" << full_time_emp.calculate_salary() << std::endl;
    std::cout << part_time_emp.get_name() << "'s Salary: $" << part_time_emp.calculate_salary() << std::endl;

    return 0;
}
```

```cpp-exec:practice9_2.cpp
Alice's Salary: $3000
Bob's Salary: $1600
```
