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


## 深入原理