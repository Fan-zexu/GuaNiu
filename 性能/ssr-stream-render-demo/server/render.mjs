import React from "react";
import { renderToPipeableStream } from "react-dom/server";
import App from "../client/src/App.jsx";

export default function render(res) {
  const appElement = React.createElement(App);
  const stream = renderToPipeableStream(appElement, {
    onShellReady() {
      res.setHeader("Content-type", "text/html");
      stream.pipe(res);
    },
    onError(error) {
      console.error(error);
      res.status(500).send("Server Error");
    },
  });
}

