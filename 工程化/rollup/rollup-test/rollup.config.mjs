import postcss from "rollup-plugin-postcss";

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
  plugins: [
    postcss({
      extract: true, // 抽离css
      extract: "index.css",
    }),
  ],
};
