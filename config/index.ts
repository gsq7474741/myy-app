import { defineConfig, type UserConfigExport } from "@tarojs/cli";
import TsconfigPathsPlugin from "tsconfig-paths-webpack-plugin";
import { createSwcRegister, getModuleDefaultExport } from "@tarojs/helper";
import AutoComponents from "unplugin-vue-components/webpack";
import NutUIResolver from "@nutui/auto-import-resolver";
import { type Options as AutoImportOptions } from "unplugin-auto-import/types";
import path from "path";
import devConfig from "./dev";
import prodConfig from "./prod";

// https://taro-docs.jd.com/docs/next/config#defineconfig-辅助函数
export default defineConfig<"webpack5">(async (merge, { command, mode }) => {
  createSwcRegister({
    only: [(filePath: string) => filePath.includes("@unocss")],
  });
  const UnoCSS = getModuleDefaultExport(
    await import("@unocss/webpack")
  ).default;
  const baseConfig: UserConfigExport<"webpack5"> = {
    projectName: "myy",
    date: "2024-12-15",
    designWidth(input) {
      // 配置 NutUI 375 尺寸
      if ((input as any)?.file?.replace(/\\+/g, "/").indexOf("@nutui") > -1) {
        return 375;
      }
      // 全局使用 Taro 默认的 750 尺寸
      return 750;
    },
    deviceRatio: {
      640: 2.34 / 2,
      750: 1,
      375: 2,
      828: 1.81 / 2,
    },
    sourceRoot: "src",
    outputRoot: "dist",
    plugins: [
      "@tarojs/plugin-html",
      [
        "@tarojs/plugin-framework-vue3",
        {
          vueLoaderOption: {
            compilerOptions: {
              whitespace: "preserve",
            },
          },
        },
      ],
      "@taro-hooks/plugin-vue",
      [
        "@taro-hooks/plugin-auto-import",
        {
          imports: ["vue"],
          dirs: ["./src/utils", "./src/stores", "./src/api"],
          dts: "./types/auto-imports.d.ts",
          vueTemplate: true,
        } satisfies AutoImportOptions,
      ],
    ],
    defineConstants: {},
    copy: {
      patterns: [],
      options: {},
    },
    framework: "vue3",
    compiler: {
      type: "webpack5",
      prebundle: {
        enable: false,
      },
    },
    cache: {
      enable: false, // Webpack 持久化缓存配置，建议开启。默认配置请参考：https://docs.taro.zone/docs/config-detail#cache
    },
    mini: {
      postcss: {
        pxtransform: {
          enable: true,
          config: {},
        },
        cssModules: {
          enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
          config: {
            namingPattern: "module", // 转换模式，取值为 global/module
            generateScopedName: "[name]__[local]___[hash:base64:5]",
          },
        },
        url: {
          enable: true,
          config: {
            limit: 1024, // 设定转换尺寸上限
          },
        },
      },
      webpackChain(chain) {
        chain.plugin("unocss").use(UnoCSS);
        chain.plugin("auto-components").use(
          AutoComponents({
            dirs: ["src/components"],
            directoryAsNamespace: true,
            dts: "./types/vue-components.d.ts",
            resolvers: [NutUIResolver({ taro: true })],
          })
        );
        chain.resolve.plugin("tsconfig-paths").use(TsconfigPathsPlugin);
      },
    },
    h5: {
      publicPath: "/",
      staticDirectory: "static",
      output: {
        filename: "js/[name].[hash:8].js",
        chunkFilename: "js/[name].[chunkhash:8].js",
      },
      miniCssExtractPluginOption: {
        ignoreOrder: true,
        filename: "css/[name].[hash].css",
        chunkFilename: "css/[name].[chunkhash].css",
      },
      postcss: {
        autoprefixer: {
          enable: true,
          config: {},
        },
        cssModules: {
          enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
          config: {
            namingPattern: "module", // 转换模式，取值为 global/module
            generateScopedName: "[name]__[local]___[hash:base64:5]",
          },
        },
      },
      webpackChain(chain) {
        // chain.plugin("unocss").use(UnoCSS);
        chain.resolve.plugin("tsconfig-paths").use(TsconfigPathsPlugin);
      },
    },
    rn: {
      appName: "taroDemo",
      postcss: {
        cssModules: {
          enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        },
      },
    },
    alias: {
      "@/components": path.resolve(__dirname, "..", "src/components"),
      "@/assets": path.resolve(__dirname, "..", "src/assets"),
    },
  };
  if (process.env.NODE_ENV === "development") {
    // 本地开发构建配置（不混淆压缩）
    return merge({}, baseConfig, devConfig);
  }
  // 生产构建配置（默认开启压缩混淆等）
  return merge({}, baseConfig, prodConfig);
});
