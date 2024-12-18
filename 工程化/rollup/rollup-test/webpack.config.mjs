import path from "node:path";
import { fileURLToPath } from "node:url";

/** @type {import("webpack").Configuration} */
export default {
  entry: "./src/index.js",
  mode: "development",
  devtool: false,
  output: {
    path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), "dist2"),
    filename: "bundle.js",
  },
};
