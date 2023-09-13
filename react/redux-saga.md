# 前面

一个老项目中用到了`redux-saga`，不怎么了解它的使用。在写`effect`函数时候，以为可以不使用`yield` `generator *`而改用 `async/await`，结果就有了下面这样的"改造"

![改造前后](./imgs/redux-saga-before.png)

结果就是 `put`后续并没有执行。所以就有了下面来学习下`saga`的内容。

文章：

- [redux-saga源码](https://juejin.cn/post/6885223002703822855)

- [为什么不能用async/await实现sage](https://juejin.cn/post/7014484781429850148)

