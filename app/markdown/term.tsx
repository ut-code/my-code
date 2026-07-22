import { JSX } from "react";
import { ExtraProps } from "react-markdown";
import { onlyText } from "react-children-utilities";

/**
 * https://github.com/ut-code/utcode-learn/blob/main/src/components/Term/index.tsx をもとに独自実装
 * Copyright (c) 2023 ut.code();
 */
export default function Term(props: JSX.IntrinsicElements["q"] & ExtraProps) {
  // 動作確認用
  return <>[{props.children} → term:{onlyText(props.children)}]</>;

  // const term = props.id
  //   ? terms.find((term) => term.id === props.id)
  //   : terms.find(
  //       (term) =>
  //         term.name === onlyText(props.children) ||
  //         term.aliases.includes(onlyText(props.children)),
  //     );
  // if (!term)
  // throw new Error(
  //   `${props.id ? props.id : onlyText(props.children)}という用語は定義されていません`,
  // );

  // const wrap = (content: JSX.Element) => {

  //   return (
  //     <Tippy
  //       theme="material"
  //       interactive={shouldLinkToReferencePage}
  //       appendTo={window.document.body}
  //       content={
  //         <div className={styles.tooltipContent}>
  //           <header className={styles.tooltipContentHeader}>{term.name}</header>
  //           <div>{term.definition}</div>
  //           {shouldLinkToReferencePage && (
  //             <Link className={styles.tooltipLink} to={term.referencePage}>
  //               <span>{referencePageTitle} へ</span>
  //               <MdArrowForward size="1.2rem" />
  //             </Link>
  //           )}
  //         </div>
  //       }
  //     >
  //       {content}
  //     </Tippy>
  //   );
  // };
}
