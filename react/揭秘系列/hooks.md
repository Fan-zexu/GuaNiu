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
环状单向链表：

产生第一个update（u0），此时`queue.pending === null`：

`update.next = update`即 `u0.next = u0`，此时u0**单向成环链表**，

然后`queue.pending = update;`，即`queue.pending = u0`

```
queue.pending = u0 ---> u0
                ^        |
                |        |
                ---------
```

产生第二个update（u1），此时`queue.pending === u0`：

`update.next = queue.pending.next`，即 `u1.next = u0`;

`queue.pending.next = update;`，即 `u0.next = u1`；

然后`queue.pending = update;`，即`queue.pending = u1`

```
queue.pending = u1 ---> u0
                ^        |
                |        |
                ---------
```

所以，当再产生update后，`queue.pending`指向最后一个`udpate`；`queue.pending.next`指向第一个`update`


## 状态怎么保存

每次更新的`update`保存在`queue`中

- 对于`ClassComponennt`的状态保存在**类实例**中

- 对于`FunctionComponent`状态保存在对应的**fiber**中

类似如下结构：

```js
// App组件对应的fiber结构
const fiber = {
    // 保存FunctionComponent对应的 hooks链表
    memoizedState: null,
    // 指向App函数
    stateNode: App
}
```

## Hook数据结构

`fiber.memoizedState`中保存的`hook`数据结构

这里的`hook`与`update`结构类似，但是`hook`是**无环**单向链表

```js
const hook = {
    // 保存update的queue，上面的 有环单向链表
    queue: {
        pending: null
    },
    // 保存hook对应的state
    memoizedState: initialState,
    // 指向下一个hook，即无环单向链表
    next: null
}
```

**注意：**

`update`和`hook`关系：

每个`useState`对应一个`hook`对象，

调用`const [num, updateNum] = useState(0)`;时`updateNum`（即上文介绍的`dispatchAction`）产生的`update`保存在`useState`对应的`hook.queue`中。
