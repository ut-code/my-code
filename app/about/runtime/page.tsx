import { Metadata } from "next";
import { Heading } from "@/markdown/heading";

export const metadata: Metadata = {
  title: "コード実行環境について",
  description: "my.code(); で使用しているコード実行環境の仕組みを説明します。",
};

export default function RuntimePage() {
  return (
    <div className="p-4 pb-16 w-full max-w-docs mx-auto">
      <Heading level={1}>コード実行環境について</Heading>
      <p className="my-4 opacity-80">
        my.code(); では、プログラミング言語ごとに異なる仕組みでコードを実行しています。
        以下にそれぞれの言語の実行環境について説明します。
      </p>

      <Heading level={2}>ブラウザ内で実行される言語</Heading>
      <p className="my-4 opacity-80">
        以下の言語は、サーバーへの通信を行わず、すべてお使いのブラウザ内で実行されます。
        そのため、インターネット接続が不安定な環境でも、一度ページが読み込まれれば実行可能です。
      </p>

      <div className="flex flex-col gap-6 my-6">
        <div className="card bg-base-200 shadow-sm">
          <div className="card-body">
            <h3 className="card-title">Python</h3>
            <p>
              Python は{" "}
              <a
                className="link link-primary"
                href="https://pyodide.org/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Pyodide
              </a>{" "}
              を使用して実行されます。Pyodide は CPython（Python の公式実装）を
              WebAssembly にコンパイルしたものです。Python コードはブラウザ内の
              Web Worker 上で動作するため、ページの描画をブロックせずに実行できます。
            </p>
          </div>
        </div>

        <div className="card bg-base-200 shadow-sm">
          <div className="card-body">
            <h3 className="card-title">Ruby</h3>
            <p>
              Ruby は{" "}
              <a
                className="link link-primary"
                href="https://ruby.github.io/ruby.wasm/"
                target="_blank"
                rel="noopener noreferrer"
              >
                ruby.wasm
              </a>{" "}
              を使用して実行されます。ruby.wasm は公式の CRuby を WebAssembly
              にコンパイルしたものです。Python と同様に Web Worker 上で動作します。
            </p>
          </div>
        </div>

        <div className="card bg-base-200 shadow-sm">
          <div className="card-body">
            <h3 className="card-title">JavaScript</h3>
            <p>
              JavaScript はブラウザ自身の JavaScript エンジンを利用して実行されます。
              コードは安全なサンドボックス環境内で評価されます。
            </p>
          </div>
        </div>

        <div className="card bg-base-200 shadow-sm">
          <div className="card-body">
            <h3 className="card-title">TypeScript</h3>
            <p>
              TypeScript は{" "}
              <a
                className="link link-primary"
                href="https://www.npmjs.com/package/@typescript/vfs"
                target="_blank"
                rel="noopener noreferrer"
              >
                @typescript/vfs
              </a>{" "}
              を使用してブラウザ内でコンパイルされ、その後 JavaScript
              と同じ仕組みで実行されます。
            </p>
          </div>
        </div>
      </div>

      <Heading level={2}>外部サービスを利用して実行される言語</Heading>
      <p className="my-4 opacity-80">
        以下の言語は、外部のコンパイル・実行サービス（
        <a
          className="link link-primary"
          href="https://wandbox.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Wandbox
        </a>
        ）の API を通じて実行されます。コードはサーバーに送信されてコンパイル・実行され、
        結果がブラウザに返されます。そのため、実行にはインターネット接続が必要です。
        また、入力したコードが Wandbox のサーバーに送信されることをご了承ください。
      </p>

      <div className="flex flex-col gap-6 my-6">
        <div className="card bg-base-200 shadow-sm">
          <div className="card-body">
            <h3 className="card-title">C++</h3>
            <p>
              Wandbox の g++ (GNU C++ Compiler) を使用してコンパイル・実行されます。
              最新の安定版コンパイラが使用され、Boost ライブラリも利用可能です。
              実行時にエラーが発生した場合は、スタックトレースが表示されます。
            </p>
          </div>
        </div>

        <div className="card bg-base-200 shadow-sm">
          <div className="card-body">
            <h3 className="card-title">Rust</h3>
            <p>
              Wandbox の rustc (Rust コンパイラ) を使用してコンパイル・実行されます。
              最新版のコンパイラが使用されます。
            </p>
          </div>
        </div>
      </div>

      <div className="alert alert-warning alert-dash my-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 shrink-0 stroke-current"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <div>
          <p>
            外部サービスを利用して実行される言語（C++・Rust）では、入力したコードが外部サーバーに送信されます。
            個人情報や機密情報を含むコードは入力しないようにしてください。
          </p>
        </div>
      </div>
    </div>
  );
}
