# 前面

一个老项目中用到了`redux-saga`，不怎么了解它的使用。在写`effect`函数时候，以为可以不使用`yield` `generator *`而改用 `async/await`，结果就有了下面这样的"改造"

![改造前后](./imgs/redux-saga-before.png)

结果就是 `put`后续并没有执行。所以就有了下面来学习下`saga`的内容。