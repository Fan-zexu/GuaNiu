# 如何优雅处理渲染异常

## 表现

渲染异常的表现：**白屏**

由于`React`客户端渲染`CSR`自身的设计，页面渲染完全由JS控制，也就是页面组件中的`render函数`，一旦在JS线程中出现异常，就会阻塞后续所有JS执行，直接导致页面“白屏”

## 异常处理

在`React`中提供了两个生命周期：`componentDidCatch` 和 `static getDerivedStateFromError` 来解决这类问题

> [componentDidCatch](https://zh-hans.legacy.reactjs.org/docs/react-component.html#componentdidcatch)

> [static getDerivedStateFromError](https://zh-hans.legacy.reactjs.org/docs/react-component.html#static-getderivedstatefromerror)

看下面这个`ErrorBoundary`组件

```js
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            hasError: false,
        }
    }

    static getDerivedStateFromError(error) {
        // 有错误时会调用这个钩子，return一个状态，来更新state
        // 官方推荐：通过这个静态方法来渲染降级UI组件
        return { hasError: true }
    }

    // info是componentStack，表示组件错误栈
    // 这个钩子里处理副作用
    componentDidCatch(error, info) {
        // Example "componentStack":
        //   in ComponentThatThrows (created by App)
        //   in ErrorBoundary (created by App)
        //   in div (created by App)
        //   in App
        logComponentStackToMyService(info.componentStack);
    }

    render() {
        if (this.state.hasError) {
        // You can render any custom fallback UI
        return <h1>Something went wrong.</h1>;
        }

        return this.props.children;
    }
}
```

## 代码演示

移步 `react-example`项目

## react-error-boundary

在`class`组件中需要 `getDerivedStateFromError + componentDidCatch` 配合使用

在`funciton`组件中，可以引入`yarn install react-error-boundary`来实现：

```js
import { ErrorBoundary } from "react-error-boundary";

function Bbb() {
  const b = window.a.b;

  return <div>{b}</div>
}

function fallbackRender({ error }) {
  return (
    <div>
      <p>出错了：</p>
      <div>{error.message}</div>
    </div>
  );
}

export default function App() {
  return <ErrorBoundary fallback={fallbackRender}>
    <Bbb></Bbb>
  </ErrorBoundary>
}

```

# Suspense 和 ErrorBoundary 关系

> [光神的一篇文章](https://juejin.cn/post/7315231440777527334)

讲到了`React Suspense`和`ErrorBoundary`的关系，看到关于实现的方式很巧妙。这里记录一下

核心是用到了 **`throw promise` 和 `throw error`**

## React Suspense用法

在react里 `suspense`配合`lazy`实现异步加载

```js
import React, { Suspense } from 'react';

const LazyA = React.lazy(() => import('./A'));

export default function App() {
    return (
        <Suspense fallback="loading...">
            <LazyA />
        </Suspense>
    )
}
```

## Suspense原理

`ErrorBoundary`通过捕获子组件或者子孙组件中的error来渲染对应的`fallback内容`

`Suspense`也是类似`ErrorBoundary`一样的实现。类似`throw error`。

比如下面代码，也可以在不是用`React.lazy`的情况下，达到异步加载的效果

```js
import { Suspense } from "react";

let data, promise;
function fetchData() {
  if (data) return data;
  promise = new Promise(resolve => {
    setTimeout(() => {
      data = '取到的数据'
      resolve()
    }, 2000)
  })
  throw promise;
}

function Content() {
  const data = fetchData();
  return <p>{data}</p>
}

export default function App() {
  return (
    <Suspense fallback={'loading data'}>
      <Content />
    </Suspense>
  )
}

```

也就是说`throw promise`会被最近的一个`Suspense`捕获。

`promise`的初始状态展示`fallback`组价，`resolve`状态展示子组件。


其实`React.lazy`也是这么实现的

![react-lazy](./imgs/react-lazy.awebp)

可以看到通过`React.lazy`的包裹，可以实现一个`throw promise`来触发`Suspense`。

当 promise 改变状态后，再返回拿到的值。