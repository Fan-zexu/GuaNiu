# 如何优雅处理渲染异常

## 表现

渲染异常的表现：**白屏**

由于`React`客户端渲染`CSR`自身的设计，页面渲染完全由JS控制，也就是页面组件中的`render函数`，一旦在JS线程中出现异常，就会阻塞后续所有JS执行，直接导致页面“白屏”

## 异常处理

在`React`中提供了两个生命周期：`componentDidCatch` 和 `static getDerivedStateFromError` 来解决这类问题

> [componentDidCatch](https://zh-hans.legacy.reactjs.org/docs/react-component.html#componentdidcatch)



