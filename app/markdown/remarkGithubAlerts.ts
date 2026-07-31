import { visit } from "unist-util-visit";
import type { Plugin } from "unified";
import type { Root, PhrasingContent } from "mdast";

/*
https://github.com/jaywcjlove/remark-github-blockquote-alert のコピペ、改変

MIT License

Copyright (c) 2025 Kenny Wang(小弟调调™) <kennyiseeyou@gmail.com> (https://github.com/jaywcjlove)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
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
