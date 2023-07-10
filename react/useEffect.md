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

## 深入原理