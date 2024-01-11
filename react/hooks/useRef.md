# useRef

## 关于useState、useRef、变量的使用区别

**`useState`和`useRef`区别好理解，**

`useState`的`state`变化会引起`render`。同时`setState`是异步更新，在`setState`之后无法立即获取**最新的状态**

`useRef`定义的变量变化后，不会引起`render`，同时在更新之后可以通过`ref.current`立即获取最新的值 

**`useRef`和变量**：

```js
let value1

const App = () => {
    const value2 = useRef(0)

    // 改变value形式1
    value1 = 1;
    // 改版value形式2
    value2.current = 1;

    // log，都是1
    console.log(value)
}
```

这两种方式看起无差异，但是在组件外定义变量，属于全局变量`global`，当相同组件被使用多次，全局变量会存在冲突情况。

反观`ref`它是和组件一一对应的，不会出现冲突情况。

参考这个[demo](https://codesandbox.io/s/interesting-turing-91nt1?fontsize=14&hidenavigation=1&theme=dark&file=/src/App.js:551-565)