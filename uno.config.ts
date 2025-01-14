// unocss.config.ts
import presetWeapp, { colors } from "unocss-preset-weapp";
import { FileSystemIconLoader } from "@iconify/utils/lib/loader/node-loaders";
import fs from "node:fs/promises";
import {
  defaultRules,
  transformerClass,
} from "unocss-preset-weapp/transformer";
import {
  presetIcons,
  defineConfig,
  transformerCompileClass,
  Awaitable,
} from "unocss";

const transformRules = {
  ...defaultRules,
  ":": "-c",
  "&": "-amp",
  ">": "-gt",
  "<": "-lt",
  "\\": "-rs",
  "/": "-s",
  ".": "-d",
  "%": "-p",
  "!": "-q",
  "#": "-w",
  "(": "-bl",
  ")": "-br",
  "[": "-fl",
  "]": "-fr",
  $: "-do",
  ",": "-co",
  "=": "-eq",
  "+": "-pl",
  "*": "-star",
};

const myyIcons = () =>
  fs.readdir("./src/assets/icon").then((names) =>
    Object.fromEntries(
      names
        .map((item) => {
          const result = item.match(/^(?:icon-)?([\w-]+)\.svg$/);
          if (!result) return null;

          return [
            result[1],
            () => fs.readFile(`./src/assets/icon/${item}`, "utf-8"),
          ];
        })
        .filter((x) => x !== null)
    )
  );

export default defineConfig({
  presets: [
    // presetMini(),
    // https://github.com/MellowCo/unocss-preset-weapp
    presetWeapp(
      // 以下配置为 webpack4 平台
      // h5兼容设置，默认为 750 标准（designWidth: 750），webpack4 平台(taroWebpack: webpack4)
      // 只开发小程序可删除
      {
        isH5: process.env.TARO_ENV === "h5",
        taroWebpack: "webpack5",

        platform: "taro",
        transformRules,
      }
    ),
    // attributify autocomplete

    presetIcons({
      customizations: {},
      collections: {
        myy: FileSystemIconLoader("./src/assets/icon", (svg) =>
          svg.replace(/#fff/, "currentColor")
        ),
      },
    }),
  ],
  shortcuts: [
    {
      center: "flex justify-center items-center",
    },
  ],
  transformers: [
    // https://github.com/MellowCo/unocss-preset-weapp/tree/main/src/transformer/transformerClass
    transformerClass({ transformRules }),
    transformerCompileClass(),
  ],

  content: {
    filesystem: ["./types/icon.d.ts"],
    pipeline: {
      include: [/\.(vue|svelte|[jt]sx?|mdx?|astro|elm|php|phtml|html)($|\?)/],
    },
  },
  theme: {
    colors: {
      primary: {
        DEFAULT: "#1f6df9",
      },
    },
  },
});
