"use client";

import clsx from "clsx";
import { ReactNode, useEffect, useState } from "react";

interface Props {
  className?: string;
  classNameModal?: string;
  classNameNonModal?: string;
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}
export function Modal(props: Props) {
  const [daisyModalEnabled, setDaisyModalEnabled] = useState(false);
  const [daisyModalOpen, setDaisyModalOpen] = useState(false);
  useEffect(() => {
    if (props.open) {
      // daisyuiのmodalモードにする → modalを開くアニメーションをする
      setDaisyModalEnabled(true);
      requestAnimationFrame(() => setDaisyModalOpen(true));
    } else {
      // 逆順
      setDaisyModalOpen(false);
      // アニメーションが終わった後にmodalモードを解除する
      const timeout = setTimeout(() => setDaisyModalEnabled(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [props.open]);

  return (
    <>
      <input
        type="checkbox"
        className="modal-toggle"
        checked={daisyModalOpen}
        readOnly
      />
      <div
        className={clsx(daisyModalEnabled && "modal")}
        role={daisyModalEnabled ? "dialog" : undefined}
      >
        <div
          className={clsx(
            daisyModalEnabled
              ? clsx(
                  "modal-box",
                  "max-w-300 p-0",
                  "size-[calc(100%-1rem)]",
                  "md:size-[calc(100%-2rem)]",
                  "lg:size-[calc(100%-4rem)]",
                  "xl:size-[calc(100%-6rem)]",
                  props.classNameModal
                )
              : clsx(props.classNameNonModal),
            props.className
          )}
        >
          {props.children}
        </div>
        <div className={daisyModalEnabled ? "modal-backdrop" : "hidden"}>
          <button onClick={props.onClose}>close</button>
        </div>
      </div>
    </>
  );
}

export function MinMaxButton(props: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  return (
    <button
      className={clsx("btn btn-xs btn-soft btn-accent mt-1 mb-1 mr-2")}
      onClick={() => props.setOpen(!props.open)}
    >
      {props.open ? (
        /*<!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->*/
        <svg
          className="w-3 h-3"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2 22L9 15M9 15H3.14286M9 15V20.8571"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M22 2L15 9M15 9H20.8571M15 9V3.14286"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        /*<!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->*/
        <svg
          className="w-3 h-3"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9 15L2 22M2 22H7.85714M2 22V16.1429"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M15 9L22 2M22 2H16.1429M22 2V7.85714"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
      <span className="hidden md:inline">{props.open ? "戻る" : "最大化"}</span>
    </button>
  );
}
