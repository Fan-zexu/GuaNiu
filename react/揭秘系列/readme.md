# 前面

今天开始学习卡颂的[react技术揭秘](https://react.iamkasong.com/)

之前看过vue揭秘，是黄轶大佬出品，让我对vue原理有了进一步理解。希望这个react揭秘也能带给我惊喜~

# 概念篇

## react理念

`react`作为UI渲染库，主要解决的2个问题：

- CPU瓶颈

- IO瓶颈

### CPU瓶颈

针对CPU瓶颈，这里举例，当渲染一个有3000个元素的页面，页面会有明显卡顿。这是因为，浏览器的**JS线程**会阻塞**GUI渲染线程**，当执行密集JS运算时，耗时大于16ms，用户就会感觉到页面的卡顿。

解决这个问题的答案就是：**时间切片（time slice）** 即在浏览器每一帧的渲染时间中，预留给JS一些执行时间，初始是5ms[源码](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/scheduler/src/forks/SchedulerHostConfig.default.js#L119)。所以当JS执行耗时大于5ms时，`react`会将线程控制权还给渲染线程，没有执行完的JS会在下一帧的预留时间中**继续执行**

这里的之所以可以继续执行，是归功于**时间切片**，而它的关键就是：将**同步更新**转为**可中断的异步更新**

### IO瓶颈

这里举例，当页面渲染前需要接口请求，此时一般情况会增加`loading`来进行兜底。

`react`提出了[Suspense](https://zh-hans.reactjs.org/docs/concurrent-mode-suspense.html)功能，配套的hook——useDeferredValue，来进行优化。

这其中的实现，也依托于将**同步更新**转为**可中断的异步更新**