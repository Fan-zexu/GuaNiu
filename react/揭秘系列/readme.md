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

---

## 老React架构

由于`React15`版本不能满足快速响应式，所以被重构.

### React15

架构分为两层：

- `Reconciler` 协调器，负责找到**变化的组件**

- `Renderer` 渲染器，复杂将变化的组件渲染到页面

#### Reconciler

`React`通过 `this.setState`, `this.forceUpdate`, `ReactDOM.render`等api来触发更新

每当有更新时，协调器工作:

- 调用组件的`render`，将`jsx`转为虚拟DOM

- 将虚拟DOM和上次更新时的虚拟DOM对比

- 通过对比找出本次更新中变化的虚拟DOM

- 通知`Renderer`将变化的虚拟DOM渲染到页面上

> [Reconciler官方介绍](https://zh-hans.reactjs.org/docs/codebase-overview.html#reconcilers)

#### Renderer

React中渲染器支持跨平台，不同平台对应不同的渲染器实现。`web`端对应的是`ReactDOM`

- ReactNative，渲染App原生组件

- ReactTest，渲染出纯Js对象用于测试

- ReactArt，渲染到Canvas, SVG 或 VML (IE8)

在每次更新发生时，`Renderer`接到`Reconciler`通知，将变化的组件渲染在当前宿主环境。

> [Renderer官方介绍](https://zh-hans.reactjs.org/docs/codebase-overview.html#renderers)

### React15架构缺点

在`Reconciler`中，组件的`mount`会调用 `mountComponent`，组件`update`会调用`updateComponet`。这两个方法都会**递归更新子组件**

递归更新的缺点：**中途不能中断**

这里有一个模拟中途中断的例子，但其实React15不支持中断。[demo](https://react.iamkasong.com/preparation/oldConstructure.html#react15%E6%9E%B6%E6%9E%84%E7%9A%84%E7%BC%BA%E7%82%B9)

所以中途中断后，渲染会错误。所以这也是React15被重构的原因。

---

## 新架构

### React16架构

架构分3层：

- Scheduler 调度器，调度任务的优先级，高优任务优先进入**Reconciler**

- Reconciler 协调器，找出变化的组件

- Renderer 渲染器，将变化的组件渲染到页面上

和React15的区别在于 增加了`Scheduler`层

#### Scheduler

我们以浏览器是否有空闲时间，来作为是否任务中断的依据，那么我们需要一种机制，当浏览器有空闲时间时候通知我们。

这个API叫做 **`requestIdleCallback`**

部分浏览器已经实现了这个API，但是`react`官方并没有使用它，原因：

1. 浏览器兼容性问题
2. 触发频率不稳定，当切换tab之后，之前tab注册的requestIdleCallback触发频率会降低

所以`react`自己实现了一个`requestIdleCallback`的`polyfill`，叫做`Scheduler`。

除了在空闲时间回调之外，还提供了多种调度优先级供任务设置。

#### Reconciler

`react15`是通过递归来`diff`虚拟DOM，所以不能实现中断。

`react16`改为可中断的循环，每次循环都会调用`shouldYield`判断是否有剩余时间，[源码](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiberWorkLoop.new.js#L1673)

```js
/** @noinline */
function workLoopConcurrent() {
  // Perform work until Scheduler asks us to yield
  while (workInProgress !== null && !shouldYield()) {
    workInProgress = performUnitOfWork(workInProgress);
  }
}
```

问题：`react16`怎么解决中断后，DOM渲染不完全问题

答：`Reconciler`和`Renderer`不再交替工作。当`Scheduler`将任务交给`Reconciler`之后，`Reconciler`会给变化的虚拟DOM打上标记，比如新增、删除、修改。[全部标记](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactSideEffectTags.js)

```js
export const Placement = /*             */ 0b0000000000010;
export const Update = /*                */ 0b0000000000100;
export const PlacementAndUpdate = /*    */ 0b0000000000110;
export const Deletion = /*              */ 0b0000000001000;
```

这里就是运用位运算了

只有当所有组件都完成了`Reconciler`的工作后，才会被统一交给`Renderer`来渲染。

> [这里](https://zh-hans.reactjs.org/docs/codebase-overview.html#fiber-reconciler)可以看官方对`Reconciler`描述

#### Renderer

![流程图](../imgs/react16-process.png)

红框部分可能随时中断，中断条件：

- 有优先级更高的任务需要先更新

- 当前帧没有剩余时间

红框中的工作都在内存中进行，不会更新页面DOM，及时反复中断，用户也不会看到更新不全的DOM

### 总结

- `react16`引入`Scheduler`，来进行任务调度，设置优先级

- 新的`Reconciler`，内容使用`Fiber`架构

---

## Fiber架构的心智模型

### 代数效应 Algebraic Effects

**它是函数式编程中的概念，用于将副作用从函数中分离**