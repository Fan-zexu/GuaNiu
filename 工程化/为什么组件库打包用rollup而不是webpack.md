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

