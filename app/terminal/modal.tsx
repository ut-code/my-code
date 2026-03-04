"use client";

import clsx from "clsx";
import { ReactNode, useEffect, useRef } from "react";

/*
https://daisyui.com/components/modal/ の3の方法を採用している。
ただし、modalのコンテナ自体を条件付きでレンダリングするので、aタグでの開閉だけでなくstateが必要になる。
urlハッシュとstateを両方同時にtrueにしてもモーダルを開くアニメーションはするっぽい
*/

interface Props {
  id: string;
  className?: string;
  classNameModal?: string;
  classNameNonModal?: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  children: ReactNode;
}
export function Modal(props: Props) {
  const modalDivRef = useRef<HTMLDivElement>(null);
  const { id, open, setOpen } = props;
  useEffect(() => {
    const onHashChange = () => {
      if (location.hash === `#${id}`) {
        setOpen(true);
      } else {
        // アニメーションが終わった後にmodalモードを解除する
        setTimeout(() => setOpen(false), 300);
      }
    };
    onHashChange();
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [id, setOpen]);
  useEffect(() => {
    if (open) {
      const updateHeight = () => {
        if (modalDivRef.current && window.visualViewport) {
          modalDivRef.current.style.height = `${window.visualViewport.height}px`;
        }
      };
      updateHeight();
      window.visualViewport?.addEventListener("resize", updateHeight);
      return () =>
        window.visualViewport?.removeEventListener("resize", updateHeight);
    } else {
      if (modalDivRef.current) {
        modalDivRef.current.style.height = "";
      }
    }
  }, [open]);

  return (
    <div
      className={clsx(open && "modal h-dvh")}
      role={open ? "dialog" : undefined}
      ref={modalDivRef}
      id={id}
    >
      <div
        className={clsx(
          open
            ? clsx(
                "modal-box",
                "max-w-300 p-0",
                "size-full",
                "md:border-2 border-accent",
                "rounded-box-modal", // globals.cssで定義。md未満の場合、--radius-boxを上書きしこれ以下の要素のrounded-boxを無効にする
                "md:size-[calc(100%-2rem)]",
                "lg:size-[calc(100%-4rem)]",
                "xl:size-[calc(100%-6rem)]",
                props.classNameModal
              )
            : clsx(
                "border-2 border-accent rounded-box",
                "shadow-md m-2 h-max",
                props.classNameNonModal
              ),
          props.className
        )}
      >
        {props.children}
      </div>
      <div className={open ? "modal-backdrop" : "hidden"}>
        <button onClick={() => history.back()}>close</button>
      </div>
    </div>
  );
}

export function MinMaxButton(props: { open: boolean; id: string }) {
  return (
    <button
      className={clsx("btn btn-sm btn-soft btn-accent my-1 mr-1")}
      onClick={() => {
        if (props.open) {
          history.back();
        } else {
          // props.setOpen(true);
          location.href = `#${props.id}`;
        }
      }}
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
