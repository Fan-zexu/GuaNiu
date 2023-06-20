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

## 深入原理