---
id: javascript-control-2-switch
title: switch文
level: 3
---

### switch文

`switch` 文も標準的ですが、比較が **厳密等価演算子 (`===`)** で行われる点に注意してください。型変換は行われません。

```js:switch_example.js
const status = "200"; // 文字列

switch (status) {
    case 200: // 数値の200と比較 -> false
        console.log("OK (Number)");
        break;
    case "200": // 文字列の"200"と比較 -> true
        console.log("OK (String)");
        break;
    default:
        console.log("Unknown status");
}
```

```js-exec:switch_example.js
OK (String)
```
