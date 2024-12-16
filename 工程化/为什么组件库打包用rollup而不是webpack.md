# 为什么组件库打包用rollup而不是webpack

[原文](https://mp.weixin.qq.com/s/j32uTAdbOH-7Y6144iq6aw)

## 打包产物对比

### rollup

```js
/** @type {import("rollup").RollupOptions} */
export default {
    input: 'src/index.js',
    output: [
        {
            file: 'dist/esm.js',
            format: 'esm'
        },
        {
            file: 'dist/cjs.js',
            format: "cjs"
        },
        {
            file: 'dist/umd.js',
            name: 'Guang',
            format: "umd"
        }
    ]
};
```

我们指定产物的模块规范有 es module、commonjs、umd 三种。

umd 是挂在全局变量上，还要指定一个全局变量的 name。

上面的 @type 是 jsdoc 的语法，也就是 ts 支持的在 js 里声明类型的方式。


#### 结果

```
npx rollup -c rollup.config.mjs
```

产物：

![rollup-cjs](./img/rollup-cjs.webp)

![rollup-esm](./img/rollup-esm.webp)

![rollup-umd](./img/rollup-umd.webp)

三种模块规范的产物都没问题。


### webpack

`webpack.config.mjs`

```js
import path from 'node:path';

/** @type {import("webpack").Configuration} */
export default {
    entry: './src/index.js',
    mode: 'development',
    devtool: false,
    output: {
        path: path.resolve(import.meta.dirname, 'dist2'),
        filename: 'bundle.js',
    }
};
```
打包后，webpack会多出一些runtime代码，比如 `code split`的代码，这样就导致打包产物不纯粹了

![webpack-codesplit-code](./img/webpack-codesplit-code.webp)

#### 构建结果

![webpack-build.webp](./img/webpack-codesplit-build.webp)

#### 浏览器加载

`import()`引入的模块，会被单独打包成一个`chunk`，在运行时会在执行到这个模块时，异步加载

![webpack-codesplit-load](./img/webpack-codesplit-load.webp)

## 结论

webpack 是为了浏览器打包而生的，而 rollup 一般用于 js 库的打包。


## antd打包

在 node_modules 下可以看到它分了 `dist、es、lib` 三个目录

`lib/ commonjs`：

![antd-lib](./img/antd-lib.webp)

`es/ es module`:

![antd-es](./img/antd-es.webp)

`dist/ umd`:

![antd-umd](./img/antd-umd.webp)