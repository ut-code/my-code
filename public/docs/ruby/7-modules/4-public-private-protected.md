---
id: ruby-modules-4-public-private-prote
title: アクセスコントロール (public, private, protected)
level: 2
---

## アクセスコントロール (public, private, protected)

Rubyのアクセスコントロールは、他の言語と少し異なる振る舞い、特に `private` の動作に特徴があります。

  * `public` (デフォルト)

      * どこからでも呼び出せます。レシーバ（`object.`）を省略しても、明示しても構いません。

  * `private`

      * **レシーバを明示して呼び出すことができません**。
      * `self.` を付けずに、クラス内部（またはサブクラス）からのみ呼び出せます。
      * 主にクラス内部の詳細を隠蔽（カプセル化）するために使われます。

  * `protected`

      * `private` と似ていますが、**同じクラス（またはサブクラス）の他のインスタンスをレシーバとして呼び出すことができます**。
      * オブジェクト同士を比較するメソッドなどで使われます。

```ruby:access_control_demo.rb
class Wallet
  attr_reader :id

  def initialize(id, amount)
    @id = id
    @balance = amount # private なインスタンス変数
  end

  # public メソッド (外部インターフェース)
  def transfer(other_wallet, amount)
    if withdraw(amount)
      other_wallet.deposit(amount)
      puts "Transferred #{amount} from #{self.id} to #{other_wallet.id}"
    else
      puts "Transfer failed: Insufficient funds in #{self.id}"
    end
  end

  # protected メソッド (インスタンス間での連携)
  protected

  def deposit(amount)
    @balance += amount
  end

  # private メソッド (内部処理)
  private

  def withdraw(amount)
    if @balance >= amount
      @balance -= amount
      true
    else
      false
    end
  end
end

w1 = Wallet.new("Wallet-A", 100)
w2 = Wallet.new("Wallet-B", 50)

# public メソッドはどこからでも呼べる
w1.transfer(w2, 70)

puts "w1 ID: #{w1.id}"
# puts "w1 Balance: #{w1.balance}" #=> NoMethodError (attr_reader がないため)

# private / protected メソッドは外部から直接呼べない
# w1.deposit(100)  #=> NoMethodError: protected method `deposit' called...
# w1.withdraw(10)  #=> NoMethodError: private method `withdraw' called...
```

```ruby-exec:access_control_demo.rb
Transferred 70 from Wallet-A to Wallet-B
w1 ID: Wallet-A
```

この例では、`transfer` (public) が内部で `withdraw` (private) を呼び出し、引数で受け取った `other_wallet` の `deposit` (protected) を呼び出しています。`deposit` は `protected` なので、`other_wallet.` というレシーバを明示しても `Wallet` クラス内からは呼び出せます。
