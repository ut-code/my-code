/**
 * daisyuiのtooltipの親に対して ref={(node) => updateTooltipPosition(node)} を指定して使う。
 * (レンダリングのたびに実行させるには、毎回同じ関数を指定するのではなくアロー関数にする必要がある(ってgeminiが言ってた))
 *
 * レンダリングのたびに、この要素の左端と右端のスペースを計算し、画面内に収まるようtooltipを水平に平行移動する。
 */
export function updateTooltipPosition(node: HTMLElement | null) {
  if (node) {
    const rect = node.getBoundingClientRect();
    node.style.setProperty(
      "--tt-trans",
      `clamp(${-(rect.left + rect.width / 2)}px, -50%, calc(${document.body.clientWidth - rect.right + rect.width / 2}px - 100%))`
    );
  }
}
