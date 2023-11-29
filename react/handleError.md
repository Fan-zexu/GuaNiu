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
