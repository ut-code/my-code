import { visit } from "unist-util-visit";
import type { Plugin } from "unified";
import type { Root, PhrasingContent } from "mdast";

/*
https://github.com/jaywcjlove/remark-github-blockquote-alert/blob/8d1cf0c5af82e6d94ed71cc814c1eb5e8819f268/src/index.ts
のコピペ、改変
*/

const alertRegex = /^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/i;
const alertLegacyRegex = /^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)(\/.*)?\]/i;

type Option = {
  /**
   * Use the legacy title format, which includes a slash and a title after the alert type.
   *
   * Enabling legacyTitle allows modifying the title, but this is not GitHub standard.
   */
  legacyTitle?: boolean;
  /**
   * The tag name of the alert container. default is `div`.
   * or you can use `blockquote` for semantic HTML.
   */
  tagName?: string;
  /**
   * Custom class names for the alert container appending to the end.
   */
  classNames?: string;
};

/**
 * Alerts are a Markdown extension based on the blockquote syntax that you can use to emphasize critical information.
 * On GitHub, they are displayed with distinctive colors and icons to indicate the significance of the content.
 * https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#alerts
 */
export const remarkAlert: Plugin<[Option?], Root> = ({
  legacyTitle = false,
  tagName = "aside",
  classNames = "",
} = {}) => {
  return (tree) => {
    visit(tree, "blockquote", (node /*, index, parent*/) => {
      let alertType = "";
      // let title = "";
      let isNext = true;
      const child = node.children.map((item) => {
        if (isNext && item.type === "paragraph") {
          const firstNode = item.children[0];
          const text = firstNode.type === "text" ? firstNode.value : "";
          const reg = legacyTitle ? alertLegacyRegex : alertRegex;
          const match = text.match(reg);
          if (match) {
            isNext = false;
            alertType = match[1].toLocaleLowerCase();
            // title = legacyTitle
            //   ? match[2] || alertType.toLocaleUpperCase()
            //   : alertType.toLocaleUpperCase();
            if (text.includes("\n")) {
              item.children[0] = {
                type: "text",
                value: text.replace(reg, "").replace(/^\n+/, ""),
              };
            }

            if (!text.includes("\n")) {
              const itemChild: Array<PhrasingContent> = [];
              item.children.forEach((item, idx) => {
                if (idx == 0) return;
                if (idx == 1 && item.type === "break") {
                  return;
                }
                itemChild.push(item);
              });
              item.children = [...itemChild];
            }
          }
        }
        return item;
      });

      if (!!alertType) {
        const daisyUIAlertClass = {
          note: "alert-info",
          tip: "alert-success",
          important: "alert-warning",
          warning: "alert-warning",
          caution: "alert-error",
        }[alertType]!;
        node.data = {
          hName: tagName,
          hProperties: {
            className: [
              // "markdown-alert",
              // `markdown-alert-${alertType}`,
              daisyUIAlertClass,
              ...classNames.split(" ").filter((s) => s.length),
            ],
            dir: "auto",
          },
        };
        // アイコンの追加は別途jsxで行う
        // child.unshift({
        //   type: "paragraph",
        //   children: [
        //     getAlertIcon(alertType as IconType),
        //     {
        //       type: "text",
        //       value: title.replace(/^\//, ""),
        //     },
        //   ],
        //   data: {
        //     hProperties: {
        //       className: "markdown-alert-title",
        //       dir: "auto",
        //     },
        //   },
        // });
      }
      node.children = [...child];
    });
  };
};

export default remarkAlert;
