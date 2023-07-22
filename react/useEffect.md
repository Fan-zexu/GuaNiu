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

---

继续文章内容。上面探讨了`props/state`以及事件处理函数。那其实`effect`也是一样的。每个effect版本中的count，都来自于它自己的那次渲染。

```js
function App() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    setTimeout(() => {
      console.log(`${count}`)
    }, 3000)
  })

  return (
    <div>
      <p>点击了 {count} 次</p>
      <button onClick={_ => setCount(count + 1)}>点击</button>
    </div>
  )
}
```
即便是上面这个例子，它也会按顺序输出每次点击的count值，而不是最后一次的值。

```js
function App(props) {
  useEffect(() => {
    setTimeout(() => {
      console.log(props.counter)
    }, 1000)
  })
}

function App(props) {
  const counter = props.counter
  useEffect(() => {
    setTimeout(() => {
      console.log(counter)
    }, 1000)
  })
}
```

同样对于函数组件内部使用props读取count，也是输出**每次渲染捕获的值**，而不是未来的值。

---

下面我们来对比一下`class`组件的情况

```js
componentDidUpdate() {
  setTimeout(() => {
    console.log(`${this.state.count}`)
  }, 3000)
}
```
在生命周期里可以看到，每次输出，`this.state.count`都指向最新的count。 如果点击3次，那么每次输出内容都是3。

如果想在函数组件内的`effect`中达到相同效果（获取未来最新的值，而不是每次捕获的值），我们可以使用`ref`来解决。
```js
function App() {
  const [count, setCount] = useState(0)
  const latestCount = useRef(count)

  useEffect(() => {
    // Set the mutable latest value
    latestCount.current = count
    setTimeout(() => {
      // Read the mutable latest value
      console.log(`${latestCount.current}`)
    }, 3000)
  })
}
```
通过ref创建的引用，可以得到最新的值。

---

所以我们可以得到结论：

在`class`内部也是像这样去修改`this.state`的，也不是去捕获。这里可以参考[demo](./react-example//src/components/ClassEffect.tsx)


### effect清理

### 关于同步

这里其实没有将到什么特别的，就是描述了下`effect`和`mount/unmount`等生命周期有所不同。函数组件会根据状态不同而重新被执行，`effect`也会重复执行，这可能对于性能不太友好，所以这里引出了可以根据传入`effect`的依赖数据来进行针对性的执行（优化）。

### 依赖项

看一个简单例子。我们在`useEffect`里面写一个轮询，去递增`count`值。一般我们会这么写，但是看看是不是有问题
```js
function App() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setCount(count + 1)
    }, 1000)
    return () => clearInterval(id)
  }, [])

  return <h1>{count}</h1>
}
```
在demo中运行后可以发现，`count`值只变化为1，并没有持续递增。这是因为count初始为0，运行一次effect后，相当于执行了一次`setCount(0+1)`，之后由于依赖设置是`[]`，所以仅effect仅执行一次就暂停了。后续的轮询一直是在执行`setCount(0+1)`。

仔细观察，effect中使用到了`count`变量，那自然而然想到下面的解决方案：

```js
useEffect(() => {
    const id = setInterval(() => {
      setCount(count + 1)
    }, 1000)
    return () => clearInterval(id)
  }, [count])
```
把`count`最为依赖传入，这样就可以保证count持续递增。看似完成了需求，但是实际有点问题。

由于`count`在持续变化，会导致effect会一直执行，也就是定时器会一直清除，再重新设定。这不是一个合理的方案。

所以我们期望在`effect`内部不依赖`count`状态。可以参考`useState`通过回调函数形式，修改state。

```js
useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c+1)
    }, 1000)
    return () => clearInterval(id)
  }, [])
```

但是`setCount(c => c+1)`这种形式也不完美，并不能很好处理类似两个相互依赖的状态，或者根据一个`prop`来计算下一次的`state`。

幸运的是，我们有一个更强大的工具，`useReducer`。

### useReducer
修改上面的例子，让他支持`count`和`step`两个状态，定时器会在每次`count`上增加一个`step`值

```js
function App() {
  const [count, setCount] = useState(0)
  const [step, setStep] = useState(1)

  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + step)
    }, 1000)
    return () => clearInterval(id)
  }, [step])

  return (
    <>
      <h1>{count}</h1>
      <input value={step} onChange={e => setStep(Number(e.target.value))} />
    </>
  )
}
```
显然这个例子在每次修改`step`值后，都会重启定时器，即清理上一次`effect`，重新执行一次`effect`。但如果我不想每次都重启定时器，要怎么取消`step`的依赖呢？

当一个状态的更新依赖另一个状态时，可以是用`useReducer`来处理，它可以把组件内改变状态的动作`action`，和状态如何修改和响应更新分开。就像redux一样，通过`dispatch`派发一个`action`来更新`state`。代码：
```js
const initialState = {
  count: 0,
  step: 1,
}

function reducer(state, action) {
  const { count, step } = state
  switch (action.type) {
    case 'tick':
      return {
        ...state,
        count: count + step
      }
    case 'step':
      return {
        ...state,
        step: action.step
      }
    default:
      return state
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const { count, step } = state

  useEffect(() => {
    const id = setInterval(() => {
      dispatch({ type: 'tick' })
    }, 1000)
    return () => clearInterval(id)
  }, [dispatch])

  return (
    <>
      <h1>{count}</h1>
      <input value={step} onChange={e => {
        dispatch({
          type: 'step',
          step: Number(e.target.value)
        })
      }} />
    </>
  )
}
```
由于`react`会保证`dispatch`在组件内不变，所以`effect`不会重新执行。

这里也可以把`effect`的依赖 `dispatch`去掉，只传一个空数组

```js
useEffect(() => {
  const id = setInterval(() => {
    dispatch({ type: 'tick' })
  }, 1000);
  return () => clearInterval(id);
}, [])
```

还有一个情况，就是在`reducer`中访问`props`，我们可以把`reducer`放在具体组件内部，这样就可以访问到`props`了。

## 深入原理
