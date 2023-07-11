# 你不知道的useEffect

## 介绍

## 技巧

### 在useEffect中使用async/await
常见的一种用法，将`useEffect`最为挂载钩子，去处理请求。
```js
useEffect(async () => {
    await getRemoteData();
}, [])
```
这种写法存在问题，由于`useEffect`要求返回值为null，或者一个`cleanup`清理函数，但在这里使用`async`，返回的是一个`promise`，会导致react在调用清理函数时报错：`function.apply is undefined`

#### 解决1：自定义hook，实现一个useAsyncEffect
```js
function useAsyncEffect(effect: () => Promise<void | (() => void)>, dependencies?: any[]) {
    return useEffect(() => {
        const cleanupPromise = effect();
        return () => { cleanupPromise.then(cleanup => cleanup && cleanup()) }
    }, dependencies)

    // 或者内部使用IIFE
    useEffect(() => {
        (
            await effect();
        )()
    })
}


useAsyncEffect(async () => {
    const count = await fetchData(params);
    setCount(count);
    return () => {
        clearTimeout(timer);
    };
}, [params]);
```
#### 解决2：使用useCallback将异步方法封装

### useEffect模拟componentDidMount

`useEffect(fn, [])`类似`componentDidMount`，但是还是不太一样

### 在useEffect中请求数据

可以参考上面useEffect中使用async，也可以参考这篇文章[react-hooks-fetch-data](https://www.robinwieruch.de/react-hooks-fetch-data/)

### 是否把函数当做effect的依赖

有时候`useEffect`的依赖是空数组的时候，也是不安全的，比如下面这个例子。
参考官方的[FAQ](https://zh-hans.legacy.reactjs.org/docs/hooks-faq.html#is-it-safe-to-omit-functions-from-the-list-of-dependencies)

```js
function Example({ someProp }) {
  function doSomething() {
    console.log(someProp);
  }

  useEffect(() => {
    doSomething();
  }, []); // 🔴 这样不安全（它调用的 `doSomething` 函数使用了 `someProp`）
}
```
- 我们一般把不依赖state,props的函数放到组件外面
- 把仅在effect中调用的函数，放在effect中
- 在effect中引入组件内部函数（函数中包含state,props或者是通过props传入的函数），可以用`useCallback`包一层

### effect中请求出现无限重复调用情况

在effect中发起请求，但是并没有设置依赖，这样每次组件有状态更新，都是重新执行effect，导致请求被无限重复执行。可以参考[demo](./react-example//src/components/useEffect.tsx)

### 获取上一次的props和state
可以在useEffect中实现，[demo](./react-example/src/components/useEffect.tsx)

```js
useEffect(() => {
    api.subscribe(props.id); // 最新的props.id
    return () => api.unsubscribe(props.id); // 上一次旧的props.id
}, [props.id])
```
类似这种订阅和取消订阅的场景。当props.id发生变化，则订阅最新的id，并在**清理函数的闭包中**，自动获取到上一次的id，用来取消订阅。

**这里还发现一个有意思的现象**，竟然是cleanup这个清理函数，在useEffect中，先被执行 ！！

是不是因为这个原因，才可以在清理函数中获取上一次的props。哈哈哈

### 为什么总是获取旧的props和state
看官网的例子。先点击【show alert】，然后立即点击【click me】，此时3秒后，打印的count还是初始值0，而不是1。
```js
function Example() {
  const [count, setCount] = useState(0);

  function handleAlertClick() {
    setTimeout(() => {
      alert('You clicked on: ' + count);
    }, 3000);
  }

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
      <button onClick={handleAlertClick}>
        Show alert
      </button>
    </div>
  );
}
```
你可以通过`ref`来解决
```js
function ExampleRef() {
  const [count, setCount] = useState(0);
  const ref = useRef();

  function handleAlertClick() {
    setTimeout(() => {
      alert('You clicked on: ' + ref.current);
    }, 3000);
  }

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => {
            setCount(count + 1);
            ref.current = count + 1;
        }}>
        Click me
      </button>
      <button onClick={handleAlertClick}>
        Show alert
      </button>
    </div>
  );
}
```

我们后面会来深入分析一波。这里我猜测和react每次状态更新都是一次快照，所以第一个旧state的例子，及时放在异步里面去获取state，获取的也是第一次的快照数据。

而`ref.current`，这是一种引用类型，不受快照限制。所以获取的是最新的数据。

---

这里分隔一下 。。。看了文章之后，对于我上面的猜测做一些解答。

react对于每一次渲染来说，props和state都是独立的，props和state都属于这次渲染。

同时，**事件处理函数**也是如此。

在上面例子中count在每一次函数调用中都是常量，每次函数组件渲染时都会调用到。这并不是`react`所特有的，而是普通函数都有的行为。---> wc这确实没想到，其实很简单，理解复杂了...

可以看下面这个简单js的例子

```js
function sayHi(person) {
  const name = person.name
  setTimeout(() => {
    alert(`Hi, ${name}`)
  }, 3000)
}

let someone = { name: 'zhangsan' }
sayHi(someone)

someone = { name: 'lisi' }
sayHi(someone)

someone = { name: 'wangwu' }
sayHi(someone)

```

在控制台输出，发现每次打印都是那次运行中获取的name值，并不是最后一次的值。

这就解释了我们的事件处理函数如何捕获点击时候的count值，这是因为每次渲染都有一个新版的`handleAlertClick`被创建并执行，每个版本都会记住它自己的count。

如下伪代码

```js
function App() {
  // ...
  function handleAlertClick() {
    setTimeout(() => {
      alert(0)
    }, 3000)
  }
  <button onClick={handleAlertClick} />  // The one with 0 inside
}

function App() {
  // ...
  function handleAlertClick() {
    setTimeout(() => {
      alert(1)
    }, 3000)
  }
  <button onClick={handleAlertClick} />  // The one with 1 inside
}

function App() {
  // ...
  function handleAlertClick() {
    setTimeout(() => {
      alert(2)
    }, 3000)
  }
  <button onClick={handleAlertClick} />  // The one with 2 inside
}
```

---

缓一波，捋一捋。其实react的处理并不特殊，就是用到的js最原始的特性。

在任意一次渲染中，props 和 state 是始终保持不变的，如果 props 和 state 在不同的渲染中是相互独立的，那么使用到它们的任何值也是独立的（包括事件处理函数），它们都属于一次特定的渲染，即便是事件处理中的异步函数调用所得到的的也是这次渲染中的 count 值

## 深入原理
