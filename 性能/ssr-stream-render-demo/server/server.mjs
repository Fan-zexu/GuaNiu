// import { register } from '@babel/register';
// register({
//   presets: ['@babel/preset-env', '@babel/preset-react'],
//   extensions: ['.js', '.jsx']
// });
import express from "express";
import path from "path";
import render from "./render.mjs";

const app = express();
const port = 3000;

// 静态文件服务
app.use(express.static(path.join(process.cwd(), "public")));

// SSR 路由
app.get("/", (req, res) => {
  render(res);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
