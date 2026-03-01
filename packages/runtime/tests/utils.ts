import { RuntimeContext } from "@my-code/runtime/interface";
import { RuntimeLang } from "@my-code/runtime/languages";
import { RefObject } from "react";

export const RUNTIME_TIMEOUTS: Record<RuntimeLang, number> = {
  python: 2000,
  ruby: 5000,
  javascript: 2000,
  typescript: 2000,
  cpp: 10000,
  rust: 10000,
};

export async function waitForRuntimeReady(
  lang: RuntimeLang,
  runtimeRef: RefObject<Record<RuntimeLang, RuntimeContext> | null>
) {
  while (true) {
    if (runtimeRef.current) {
      const runtime = runtimeRef.current[lang];
      if (runtime.ready) {
        const isLocked = runtime.mutex?.isLocked();
        if (!isLocked) {
          break;
        }
      }else{
        runtime.init?.();
      }
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  await new Promise((resolve) => setTimeout(resolve, 50));
}

export type TestBody = (
  runtimeRef: RefObject<Record<RuntimeLang, RuntimeContext>>
) => Promise<void>;
