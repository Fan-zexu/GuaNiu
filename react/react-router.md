# 原理分析

## `history api`

主要利用`history api`来实现，主要功能：

- `history.back` 后退

- `history.forward` 前进

- `history.go`，参数是数字，比如 `go(0)`刷新，`go(1)`前进一个，`go(-1)`后退一个

- `history.replaceState`，**替换**原有`history` ，用法`history.replaceState({a: 1}, '', 'https://baidu.com')`

接收3个参数：

1. 第一个是`state`相当于是url携带的参数，但是不会体现在url里

2. 第二个是`title`，基本不支持

3. 第三个是替换的`url`

使用后，不会新增历史记录，而是替换

- `history.pushState`，**新增history**，`history.pushState({a: 1}, '', 'xxxxurl')`

有一个问题，在`pushState`之后，后面的历史记录就会被清空

- `history.scrollRestoration`，用来保留滚动位置的，默认是`auto`，会自动定位到上次滚动的位置。`manual`就不会

## history 事件

1. `popState`，当在导航中执行`forward`、`back`、`go`操作时，就会触发`popState`，

但是 `pushState`、`replaceState`就不会触发`popState`

```js
window.addEventListener('popState', event => { console.log(event) } )
```

2. `hashchange`

它只能监听`#`井号后面的内容变化，功能相比`popState`薄弱，`react-router`也是使用`popState`实现的