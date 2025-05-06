const path = require("path");

module.exports = {
  entry: path.resolve(__dirname, "src/App.jsx"),
  // entry: "./src/App.jsx",
  output: {
    path: path.resolve(__dirname, "../public"),
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
};
