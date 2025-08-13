"use client";

import { useEffect, useRef, useState } from "react";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";

/**
 * 文字列の幅を計算する。
 * 厳密にやるなら @xterm/xterm/src/common/input/UnicodeV6.ts を使うとよさそう
 * (しかしそれをimportしても動かなかった)
 *
 * とりあえず日本語と英数を最低限区別するでっち上げ実装にしている
 *
 */
export function strWidth(str: string): number {
  let len: number = 0;
  for (const char of str) {
    if (char.charCodeAt(0) < 0x2000) {
      len += 1;
    } else {
      len += 2;
    }
  }
  return len;
}

/**
 * contentsがちょうど収まるターミナルの高さを計算する
 */
export function getRows(contents: string, cols: number): number {
  return contents
    .split("\n")
    .reduce(
      (rows, line) => rows + Math.max(1, Math.ceil(strWidth(line) / cols)),
      0
    );
}

// なぜか term.clear(); が効かない場合がある... これは効く
export function clearTerminal(term: Terminal){
  // term.clear();
  term.write("\x1b[3J\x1b[2J\x1b[1;1H");
}

interface TerminalProps {
  getRows?: (cols: number) => number;
  onReady?: () => void;
}
export function useTerminal(props: TerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null!);
  const terminalInstanceRef = useRef<Terminal | null>(null);
  const [termReady, setTermReady] = useState<boolean>(false);

  const getRowsRef = useRef<(cols: number) => number>(undefined);
  getRowsRef.current = props.getRows;
  const onReadyRef = useRef<() => void>(undefined);
  onReadyRef.current = props.onReady;

  // ターミナルの初期化処理
  useEffect(() => {
    const fromCSS = (varName: string) =>
      window.getComputedStyle(document.body).getPropertyValue(varName);
    // "--color-" + color_name のように文字列を分割するとTailwindCSSが認識せずCSSの値として出力されない場合があるので注意
    const term = new Terminal({
      cursorBlink: true,
      convertEol: true,
      cursorStyle: "bar",
      cursorInactiveStyle: "none",
      fontSize: 14,
      lineHeight: 1.4,
      letterSpacing: 0,
      fontFamily: "Inconsolata Variable",
      theme: {
        // DaisyUIの変数を使用してテーマを設定している
        // TODO: ダークテーマ/ライトテーマを切り替えたときに再設定する?
        background: fromCSS("--color-base-300"),
        foreground: fromCSS("--color-base-content"),
        cursor: fromCSS("--color-base-content"),
        selectionBackground: fromCSS("--color-primary"),
        selectionForeground: fromCSS("--color-primary-content"),
        black: fromCSS("--color-black"),
        brightBlack: fromCSS("--color-neutral-500"),
        red: fromCSS("--color-red-600"),
        brightRed: fromCSS("--color-red-400"),
        green: fromCSS("--color-green-600"),
        brightGreen: fromCSS("--color-green-400"),
        yellow: fromCSS("--color-yellow-700"),
        brightYellow: fromCSS("--color-yellow-400"),
        blue: fromCSS("--color-indigo-600"),
        brightBlue: fromCSS("--color-indigo-400"),
        magenta: fromCSS("--color-fuchsia-600"),
        brightMagenta: fromCSS("--color-fuchsia-400"),
        cyan: fromCSS("--color-cyan-600"),
        brightCyan: fromCSS("--color-cyan-400"),
        white: fromCSS("--color-base-100"),
        brightWhite: fromCSS("--color-white"),
      },
    });
    terminalInstanceRef.current = term;

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    // fitAddon.fit();

    term.open(terminalRef.current);

    setTermReady(true);
    onReadyRef.current?.();

    const observer = new ResizeObserver(() => {
      // fitAddon.fit();
      const dims = fitAddon.proposeDimensions();
      if (dims) {
        const rows = Math.max(5, getRowsRef.current?.(dims.cols) ?? 0);
        term.resize(dims.cols, rows);
      }
    });
    observer.observe(terminalRef.current);

    return () => {
      observer.disconnect();
      term.dispose();
      terminalInstanceRef.current = null;
    };
  }, []);

  return { terminalRef, terminalInstanceRef, termReady };
}
