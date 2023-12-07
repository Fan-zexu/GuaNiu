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

## 工作原理

`useState`为例

```js
function App() {
    const [num, updateNum] = useEffect(0);
    return (
        <p onClick={() => updateNum(num => num + 1)}>{num}</p>
    )
}
```

工作分为两部分：

1. 通过`updateNum`方法触发一种**更新**，使组件`render`

2. 将组件`render`时`useState`返回的值，作为更新后的结果

工作1，分为`mount`和`update`：

1. 通过`ReactDOM.render`产生`mount`的**更新**，更新内容作为`useState`的初始值`initialValue`(即 0)

2. 通过`updateNum`产生`update`的**更新**，更新内容为`num => num + 1`

## 更新

可以理解**更新**是一种数据结构，每次更新都会产生

```js
const update = {
    action,
    next: null
}
```

```js
function App() {
    const [num, updateNum] = useEffect(0);
    return (
        <p onClick={() => {
            updateNum(num => num + 1)
            updateNum(num => num + 1)
            updateNum(num => num + 1)
        }}>{num}</p>
    )
}
```
如果这样的话，点击后会产生3个`update`

## update数据结构

源码中`updateNum`实际调用 `dispatchAction.bind(null, hook.queue)`，这个函数类似如下

```js
function dispatchAction(queue, action) {
    const update = {
        action,
        next: null,
    };
    
    // 环状单向链表
    if (queue.pending === null) {
        // u0.next = u0;
        update.next = update;
    } else {
        // u1.next = u0;
        update.next = queue.pending.next;
        // u0.next = u1;
        queue.pending.next = update;
    }
    queue.pending = update;
    
    // 模拟react开始调度
    schedule();
}
```