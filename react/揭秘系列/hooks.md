# hooks

`hooks`相比于`classComponent`更趋近于`react`运行底层

用生命周期类比hooks，较好上手，但是两者概念上有很多割裂，并不能做替代。

`componentWillReceiveProps`和`useEffect`

```js
useEffect(() => {

}, [a, b])
```

但`componentWillReceiveProps`是在`render阶段`执行，而`useEffect`是在`commit阶段`执行。

> 参考：[为什么componentWillXXX UNSAFE](https://juejin.cn/post/6847902224287285255)
