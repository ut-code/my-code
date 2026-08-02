"use client";

import { ComponentPropsWithoutRef, ElementType } from "react";

/**
 * レンダリングのたびに、この要素の左端と右端のスペースを計算し、画面内に収まるようtooltipを水平に平行移動する。
 */
function updateTooltipPosition(node: HTMLElement | null) {
  if (node) {
    const rect = node.getBoundingClientRect();
    node.style.setProperty(
      "--tt-trans",
      `clamp(${-(rect.left + rect.width / 2)}px, -50%, calc(${document.body.clientWidth - rect.right + rect.width / 2}px - 100%))`
    );
  }
}

type Props<T extends ElementType> = { as: T } & Omit<
  ComponentPropsWithoutRef<T>,
  "as"
>;
export function WithAutoTooltipPosition<T extends ElementType = "div">({
  as,
  ...props
}: Props<T>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Component = as as React.ElementType<any>;
  return (
    <Component
      ref={(node: HTMLElement | null) => updateTooltipPosition(node)}
      {...props}
    />
  );
}
