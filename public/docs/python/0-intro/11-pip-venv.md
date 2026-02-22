---
id: python-intro-11-pip-venv
title: パッケージ管理ツール pip と仮想環境 venv
level: 2
---

## パッケージ管理ツール `pip` と仮想環境 `venv`

Pythonの強力なエコシステムは、豊富なサードパーティ製パッケージ（ライブラリ）によって支えられています。これらのパッケージを管理するのが **`pip`** です。

しかし、プロジェクトごとに異なるバージョンのパッケージを使いたい場合、依存関係の衝突が問題になります。これを解決するのが **仮想環境** で、Pythonでは **`venv`** モジュールを使って作成するのが標準的です。

**仮想環境とは？** 🚧
プロジェクト専用の独立したPython実行環境です。ここでインストールしたパッケージはシステム全体には影響を与えず、そのプロジェクト内に限定されます。

**基本的な流れ:**

1.  **仮想環境の作成**:

    ```bash
    # .venvという名前の仮想環境を作成
    python -m venv .venv
    ```

2.  **仮想環境の有効化（Activate）**:

    ```bash
    # macOS / Linux
    source .venv/bin/activate

    # Windows (PowerShell)
    .\.venv\Scripts\Activate.ps1
    ```

    有効化すると、ターミナルのプロンプトに `(.venv)` のような表示が付きます。

3.  **パッケージのインストール**:
    有効化された環境で `pip` を使ってパッケージをインストールします。

    ```bash
    (.venv) $ pip install requests
    ```

4.  **仮想環境の無効化（Deactivate）**:

    ```bash
    (.venv) $ deactivate
    ```

**`pyenv` でPythonバージョンを固定し、`venv` でプロジェクトのパッケージを隔離する** のが、現代的なPython開発の基本スタイルです。（前述の **Conda** は、このPythonバージョン管理と環境・パッケージ管理を両方とも行うことができます。）
