const extractArr = [];

export default function myCssExtractRollupPlugin(options) {
  return {
    name: "my-css-extract-rollup-plugin",
    transform(code, id) {
      if (!id.endsWith(".css")) return null;
      console.log("code,,,", code);
      extractArr.push(code);
      return {
        code: `export default ${JSON.stringify(code)}`,
        map: null,
      };
    },

    generateBundle() {
      this.emitFile({
        type: "asset",
        fileName: options.fileName,
        source: extractArr.join("\n/* my-extract-css */\n"),
      });
    },
  };
}
