import path from "node:path";
import MiniCssExtractPlugin from "mini-css-extract-plugin";

/** @type {import('webpack').Configuration} */
console.log(import.meta.dirname);

export default {
  entry: "./src/index.js",
  output: {
    path: path.resolve(import.meta.dirname, "dist2"),
    filename: "bundle.js",
  },
  devtool: false,
  mode: "development",
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "index.css",
    }),
  ],
};

// 低版本Node，这么实现

// import path from "node:path";
// import { fileURLToPath } from "node:url";

// /** @type {import("webpack").Configuration} */
// export default {
//   entry: "./src/index.js",
//   mode: "development",
//   devtool: false,
//   output: {
//     path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), "dist2"),
//     filename: "bundle.js",
//   },
// };
