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


## 模拟React调度更新流程

之前介绍的`updateNum`中调用`dispatchAction`中的`schedule`方法

```js
function dispatchAction(queue, action) {
  // ...创建update
  
  // ...环状单向链表操作

  // 模拟React开始调度更新
  schedule();
}
```

实现：

通过`isMount`代表是`mount`还是`update`

```js
// 首次是mount
isMount = true;

function schedule() {
    // 更新前将workInProgressHook重置为fiber中保存的第一个hook
    workInProgressHook = fiber.memoizedState;
    // 调用组件render
    fiber.stateNode();
    // mount后置为false，下次update
    isMount = false;
}
```

通过 `workInProgressHook`指向当前正在工作的`hook`

```js
workInProgressHook = fiber.memoizedState
```

当组件`render`时，每遇到下一个`useState`，只需要移动`workInProgressHook`的指针，指向下一个`hook`

```js
workInProgressHook = workInProgressHook.next
```

这样，只要组件`render`时，`useState`顺序和个数保持不变，就可以通过`workInProgressHook`找到当前`useState`对应的`hook`对象

以上，实现第一步

> 1. 通过一些操作生产出update，造成组件render

然后，实现第二步

> 2. 通过render后，updateNum返回的 num为更新后的结果

## 更新state

`useState`逻辑：

```js
function useState(initialState) {
    // 当前useState的hook变量
    let hook
    if (isMount) {
        // mount时，需要创建hook对象
    } else {
        // update时，从workInProgressHook中取出对应useState的hook
    }
    // state值
    let baseState = hook.memoizedState;
    if (hook.queue.pending) {
        // queue.pending中保存的update来更新state
    }
    hook.memoizedState = baseState;
    return [baseState, dispatchAction.bind(null, hook.queue)];
}
```

关注hook获取

```js
if (isMount) {
    // mount时，为该useState生成hook
    hook = {
        queue: {
            pending: null
        },
        memoizedState: initialState,
        next: null
    }
    // 将hook插入fiber.memoizedState链表尾部
    if (!fiber.memoizedState) {
        fiber.memoizedState = hook
    } else {
        workInProgressHook.next = hook
    }
    // 移动workInProgressHook指针
    workInProgressHook = hook
} else {
    // 更新时，找到对应hook
    hook = workInProgressHook
    // 移动workInProgressHook指针，指向下一个hook
    workInProgressHook = workInProgressHook.next
}
```

找到该`useState`对应的`hook`，如果`hook.queue.pending`存在，即存在`update`更新函数，则更新state

```js
// update执行前的初始state
let baseState = hook.memoizedState;

// 存在update
if (hook.queue.pending) {
    // 取环状链表中第一个update函数
    let fisrtUpdate = hook.queue.pending.next;

    do {
        // 执行update action
        const action = firstUpdate.action;
        baseState = action(baseState);
        firstUpdate = firstUpdate.next;

        // 最后一个update执行完，跳出循环
    } while(firstUpdate !== hook.queue.pending.next)

    // 清空queue.pending
    hook.queue.pending = null
}

// 将update action执行后的state作为memoizedState
hook.memoizedState = baseState;

return [baseState, dispatchAction.bind(null, hook.queue)]
```

## 模拟事件触发

```js
function App() {
    const [ num, updateNum ] = useState(0);
    
    console.log(`${isMount ? 'mount' : 'update'} num: `, num);

    return {
        click() {
            updateNum(num => num + 1)
        }
    }
}
```

[在线demo](https://code.h5jun.com/biqi/edit?html,js,console,output)


## 完整DEMO

```js
let workInProgressHook;
let isMount = true;

const fiber = {
  memoizedState: null,
  stateNode: App
};

function schedule() {
  workInProgressHook = fiber.memoizedState;
  const app = fiber.stateNode();
  isMount = false;
  return app;
}

function dispatchAction(queue, action) {
  const update = {
    action,
    next: null
  }
  if (queue.pending === null) {
    update.next = update;
  } else {
    update.next = queue.pending.next;
    queue.pending.next = update;
  }
  queue.pending = update;

  schedule();
}

function useState(initialState) {
  let hook;

  if (isMount) {
    hook = {
      queue: {
        pending: null
      },
      memoizedState: initialState,
      next: null
    }
    if (!fiber.memoizedState) {
      fiber.memoizedState = hook;
    } else {
      workInProgressHook.next = hook;
    }
    workInProgressHook = hook;
  } else {
    hook = workInProgressHook;
    workInProgressHook = workInProgressHook.next;
  }

  let baseState = hook.memoizedState;
  if (hook.queue.pending) {
    let firstUpdate = hook.queue.pending.next;

    do {
      const action = firstUpdate.action;
      baseState = action(baseState);
      firstUpdate = firstUpdate.next;
    } while (firstUpdate !== hook.queue.pending)

      hook.queue.pending = null;
  }
  hook.memoizedState = baseState;

  return [baseState, dispatchAction.bind(null, hook.queue)];
}

function App() {
  const [num, updateNum] = useState(0);

  console.log(`${isMount ? 'mount' : 'update'} num: `, num);

  return {
    click() {
      updateNum(num => num + 1);
    }
  }
}

window.app = schedule();
```

## 和React的区别

1. `React hooks`没有`isMount`变量，而是在不同时机调用不同的`dispatcher`，也就是`mount`和`update`使用的不同的`useState`函数

2. `React hooks`有`batchedUpdates`批量更新机制，调用3次`updateNum` 只会触发一次更新

3. `React hooks`有**跳过**更新的优化手段

4. `React hooks`有更新的**优先级**，可以跳过优先级低的更新


# hook数据结构

## dispatcher

在实际`useState`中，`mount`和`update`不同阶段的`hook`是不同的对象，这类对象称为`dispatcher`

```js
// mount时的Dispatcher
const HooksDispatcherOnMount: Dispatcher = {
  useCallback: mountCallback,
  useContext: readContext,
  useEffect: mountEffect,
  useImperativeHandle: mountImperativeHandle,
  useLayoutEffect: mountLayoutEffect,
  useMemo: mountMemo,
  useReducer: mountReducer,
  useRef: mountRef,
  useState: mountState,
  // ...省略
};

// update时的Dispatcher
const HooksDispatcherOnUpdate: Dispatcher = {
  useCallback: updateCallback,
  useContext: readContext,
  useEffect: updateEffect,
  useImperativeHandle: updateImperativeHandle,
  useLayoutEffect: updateLayoutEffect,
  useMemo: updateMemo,
  useReducer: updateReducer,
  useRef: updateRef,
  useState: updateState,
  // ...省略
};
```

`FunctionComponent`在`render`前，通过对应的`Fiber`判断`mount`还是`update`

```js
current === null || current.memoizedState === null
```

并将不同情况对应的`dispatcher`赋值给全局变量`ReactCurrentDispatcher`的current属性。

```js
ReactCurrentDispatcher.current =
      current === null || current.memoizedState === null
        ? HooksDispatcherOnMount
        : HooksDispatcherOnUpdate;  
```

> [源码](https://github.com/acdlite/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiberHooks.new.js#L409)

所以，在`FunctionComponent`渲染时，会从`ReactCurrentDispatcher.current`取当前需要的`hook`

也就是说，在不同的执行上下文，`ReactCurrentDispatcher.current`会被赋值为不同的`dispatcher`

> [其他dispatcher](https://github.com/acdlite/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiberHooks.new.js#L1775)

## 一个错误使用hook场景

错误嵌套了`hook`

```js
useEffect(() => {
  useState(0)
})
```

此时`ReactCurrentDispatcher.current`已经指向`ContextOnlyDispatcher`，所以调用`useState`实际会调用`throwInvalidHookError`，直接抛错

```js
export const ContextOnlyDispatcher: Dispatcher = {
  useCallback: throwInvalidHookError,
  useContext: throwInvalidHookError,
  useEffect: throwInvalidHookError,
  useImperativeHandle: throwInvalidHookError,
  useLayoutEffect: throwInvalidHookError,
  // ...省略
```

> [这里源码](https://github.com/acdlite/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiberHooks.new.js#L458)


## Hook数据结构

```js
const hook: Hook = {
  memoizedState: null,

  baseState: null,
  baseQueue: null,
  queue: null,

  next: null
}
```

[创建hook源码](https://github.com/acdlite/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiberHooks.new.js#L546)


## memoizedState

这里需要注意`hook`和 `FunctionComponent Fiber`中都存在`memoizedState`属性

- `fiber.memoizedState`：`FunctionComponent`对应`fiber`的`hooks`链表

- `hook.memoizedState`：`hooks`链表中单一`hook`对应的数据

不同的`hook`对应不同的`memoizedState`值：

- `useState`：`const [state, setState] = useState(initialState)`，`memoizedState`保存的`state`的值

- `useReducer`: `const [state, dispatch] = useReducer(reducer, {})`, `memoizedState`保存的`state`的值

- `useEffect`: `memoizedState`保存的`useEffect的回调函数`、`依赖项`等的链表依赖数据`effect`，`effect`链表数据也会保存在`fiber.updateQueue`中。[这里](https://github.com/acdlite/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiberHooks.new.js#L1181)可以看
`effect`创建过程

- `useRef`：比如`useRef(1)`，`memoizedState`保存的`{current: 1}`

- `useMemo`：`useMemo(callback, [dep])`，`memoizedState`保存的`[callback(), dep]`

- `useCallback`: 对于`useCallback(callback, [depA])`，`memoizedState保存[callback, depA]`。与`useMemo`区别是`useMemo`保存的是`callback`的执行结果，`useCallback`保存的是`callback`函数本身

- 有些hook是没有`memoizedState`的，比如：`useContext`

## useState 和 useReducer

这两个`hook`是由`redux`作者`Dan`贡献的，`useState`其实就是内置了`reducer`的`useReducer`，`useReducer`的一个语法糖~