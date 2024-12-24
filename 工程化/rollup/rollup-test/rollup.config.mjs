import postcss from "rollup-plugin-postcss";
import myCssExtractRollupPlugin from "./my-css-extract-rollup-plugin.mjs";

/** @type {import("rollup").RollupOptions} */
export default {
  input: "src/index.js",
  output: [
    {
      file: "dist/esm.js",
      format: "esm",
    },
    {
      file: "dist/cjs.js",
      format: "cjs",
    },
    {
      file: "dist/umd.js",
      name: "ZN",
      format: "umd",
    },
  ],
  treeshake: false,
  plugins: [
    // postcss({
    //   extract: true, // 抽离css
    //   extract: "index.css",
    // }),
    myCssExtractRollupPlugin({
      fileName: "666.css",
    }),
  ],
};
