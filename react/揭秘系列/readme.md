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

### 代数效应在react中的应用

最明显的例子：`hooks`

参考官方例子：[Suspense Demo](https://codesandbox.io/s/frosty-hermann-bztrp?file=/src/index.js)

在demo中`ProfileDetails`用来展示用户名，是一个异步请求。

在demo中可以同步书写!

```js
function ProfileDetails() {
  const user = resource.user.read();
  return <h1>{user.name}</h1>;
}
```

### 代数效应与Generator

`react15`到16最大的改变就是，重构`Reconciler`，将**同步更新**变为**异步可中断**

异步可中断更新可以理解为：更新在执行过程中可能会被打断（浏览器时间分片用尽或有更高优任务插队），当可以继续执行时恢复之前执行的中间状态。

浏览器原生支持类似实现，他就是 `Generator`

但是也被`react`放弃了，原因：

1. 也和`async/await`类似有传染性

2. 它执行的**中间状态**是有上下文关联的，这里可以参考原因的[例子](https://react.iamkasong.com/process/fiber-mental.html#%E4%BB%A3%E6%95%B0%E6%95%88%E5%BA%94%E4%B8%8Egenerator)

就是类似这样

```js
function* jobs(A,B,C) {
  var x = jobA(A);
  yield;
  var y = job(B) + x;
  yield;
  var z = job(c) + y;
  return z;
}
```

当浏览器利用空闲时间执行了A,B任务后（也就是“时间切片”），计算出y值。

但此时有优先级更高的任务插入，那此前计算y值时的x值，就需要重新计算，而不能复用。如果引入全局变量保存x值，就会增加复杂度。

> 参考这个[issue](https://github.com/facebook/react/issues/7942#issuecomment-254987818)

### 代数效应与Fiber

`Fiber`有“纤程”的意思，它并不是计算机中的新概念。而是与 进程(Process)、线程(Thread)、协程(Coroutine)，同为程序执行过程。

在JS中协程，就是`Generator` ！！！ 

所以可以理解为，`Fiber`和`Generator`就是“代数效应”思想在JS中的体现。

`React Fiber`可以理解为：

- `React`内部实现的一套状态更新机制。支持任务不同优先级，可中断与恢复，并且恢复后可以复用之前的中间状态。

- 其中每个任务更新单元为`React Element`对应的`Fiber`节点。

## Fiber架构实现原理

在新架构中，用`Fiber`来代替虚拟DOM的称呼

### Fiber起源

> 最早的官方解释 [2016年React团队成员Acdlite的一篇介绍](https://github.com/acdlite/react-fiber-architecture)

### Fiber3层含义

- `react15`的`Reconciler`已递归方式执行，数据状态保存在递归的调用栈中，所以叫做`stack Reconciler`。`react16`基于`Fiber`实现，称为`Fiber Reconciler`

- **静态：**每个`Fiber`节点对应一个`React Element`，保存了该组件的类型（函数/类/原生组件），对应的DOM节点信息

- **动态：**每个`Fiber`节点保存了本次更新中组件改变的状态、要执行的工作（增、删、改）

### Fiber的结构

[Fiber节点属性源码](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiber.new.js#L117)

按照3层含义，对节点信息划分：

```js
function FiberNode(
  tag: WorkTag,
  pendingProps: mixed,
  key: null | string,
  mode: TypeOfMode,
) {
  // 作为静态数据结构的属性
  this.tag = tag;
  this.key = key;
  this.elementType = null;
  this.type = null;
  this.stateNode = null;

  // 用于连接其他Fiber节点形成Fiber树
  this.return = null;
  this.child = null;
  this.sibling = null;
  this.index = 0;

  this.ref = null;

  // 作为动态的工作单元的属性
  this.pendingProps = pendingProps;
  this.memoizedProps = null;
  this.updateQueue = null;
  this.memoizedState = null;
  this.dependencies = null;

  this.mode = mode;

  this.effectTag = NoEffect;
  this.nextEffect = null;

  this.firstEffect = null;
  this.lastEffect = null;

  // 调度优先级相关
  this.lanes = NoLanes;
  this.childLanes = NoLanes;

  // 指向该fiber在另一次更新时对应的fiber
  this.alternate = null;
}
```

#### 作为架构

每个`Fiber`节点有个对应的`React Element`，多个`Fiber`靠下面3个属性，连起来成为树:

```js
// 指向父级Fiber节点
this.return = null;
// 指向子Fiber节点
this.child = null;
// 指向右边第一个兄弟Fiber节点
this.sibling = null;
```

🌰，组件结构：

```js
function App() {
  return (
    <div>
      i am
      <span>KaSong</span>
    </div>
  )
}
```

`Fiber`结构

![fiber](../imgs/fiber-exmaple.png);

> 这里解释了为什么父级指针叫`return`，而不是parent或者father。因为作为一个工作单元，`return`指节点执行完`completeWork`后会返回下一个节点。

> 子节点及其兄弟节点完成工作后会返回其父节点，就是`return`指向的父节点

#### 作为静态数据结构

保存了组件信息

```js
// Fiber对应组件的类型 Function/Class/Host...
this.tag = tag;
// key属性
this.key = key;
// 大部分情况同type，某些情况不同，比如FunctionComponent使用React.memo包裹
this.elementType = null;
// 对于 FunctionComponent，指函数本身，对于ClassComponent，指class，对于HostComponent，指DOM节点tagName
this.type = null;
// Fiber对应的真实DOM节点
this.stateNode = null;
```

#### 作为动态工作单元

保存了**本次更新**相关信息

```js
// 保存本次更新造成的状态改变相关信息
this.pendingProps = pendingProps;
this.memoizedProps = null;
this.updateQueue = null;
this.memoizedState = null;
this.dependencies = null;

this.mode = mode;

// 保存本次更新会造成的DOM操作
this.effectTag = NoEffect;
this.nextEffect = null;

this.firstEffect = null;
this.lastEffect = null;
```

还有调度优先级相关的信息，在`Scheduler`部分介绍

```js
// 调度优先级相关
this.lanes = NoLanes;
this.childLanes = NoLanes;
```

## 前置知识

### 深入JSX

关注几个问题：

- `JSX`和`Fiber`是同一个东西么？

- `React Component`和`React Element`是同一个东西么，和`JSX`的关系？

#### JSX

`JSX`会被编译为`React.createElement`方法。

但是在`React17`有[新的JSX转换方式](https://zh-hans.legacy.reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html)。不需要显示导入`React`


#### React.createElement

[源码](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react/src/ReactElement.js#L348)

```js
export function createElement(type, config, children) {
  // ...
  return ReactElement{
    type,
    key,
    ref,
    self,
    source,
    ReactCurrentOwner.current,
    props,
  }
}

const ReactElement = function(type, key, ref, self, source, owner, props) {
  const element = {
    // 标记这是个 React Element
    $$typeof: REACT_ELEMENT_TYPE,

    type: type,
    key: key,
    ref: ref,
    props: props,
    _owner: owner,
  };

  return element;
};
```

方法内部实际调用`ReactElement`，来生成一个包含组件数据的对象。

**重点是：** 这个对象的`$$typeof: REACT_ELEMENT_TYPE`属性，来标记这个对象是一个`React Element`

同时官方还提供了一个全局API[React.isValidElement](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react/src/ReactElement.js#L547)，来校验是否是合法的`React Element`

所以在react中，`JSX`返回的结果都是`React Element` 

#### React Component

组件分为 `ClassComponent`和`FunctionComponent`

2者无法通过引用类型区分，`React`通过`ClassComponent`实例原型上的`isReactComponent`变量来判断是否是`ClassComponent`

#### JSX和Fiber

JSX是描述组件内容的数据结构，它不包含关于`scheduler` `Reconciler` `Renderer`所需的信息。

比如：

- 组件更新的优先级

- 组件`state`

- 组件被打上用于`Renderer`的标记

在组件`mount`时，`Reconciler`会根据JSX的信息来生成组件对应的`Fiber`节点

在`update`时，`Reconciler`将`JSX`与`Fiber`节点保存的数据对比，生成组件对应的`Fiber`节点，并根据对比结果为`Fiber`节点打上标记


## Fiber架构工作原理

### ”双缓存“

它是一种绘制动画的优化手段，来防止白屏。

这里举例`canvas`绘图，下一帧渲染时，需要调用`ctx.clearRect`，把上一帧清空。如果下一帧计算量较大，会导致清空上一帧到下一帧绘制之间有较长间隙，就会出现白屏。

解决这个问题的一种方案，就是在内存中绘制下一帧内容，绘制完毕之后直接**替换**当前帧画面，这样就可以省去两帧交替的间隙，不会出现白屏到页面闪烁的问题。

这种**在内存中构建并直接替换**的技术，叫做[“双缓存”](https://baike.baidu.com/item/%E5%8F%8C%E7%BC%93%E5%86%B2)

`React`中利用“双缓存”来完成`Fiber树`的构建与替换——对应着`DOM树`的创建和更新。

### 双缓存Fiber树

在`React`中最多会同时存在两棵`Fiber树`：

- 当前屏幕显示内容对应的，称为`current Fiber树`

- 正在内存中构建的，称为`workInProgress Fiber树`

所以对应的`current fiber树的节点` => `current fiber`

对应的`workInProgress fiber树的节点` => `workInProgress fiber`

两个节点通过`alternate`属性连接。

```js
currentFiber.alternate === workInProgressFiber;
workInProgressFiber.alternate === currentFiber;
```

`React`应用的根节点通过`current`指针在不同的`Fiber树`的`rootFiber`间切换来完成`current Fiber树`指向的切换。

也就是当`workInProgress Fiber树`构建完毕，交给`Renderer`渲染到页面之后，`current`就会指向这个`workInProgress Fiber树`，此时它变成了 `current Fiber树`。

每次状态更新都会产生新的`workInProgress Fiber树`，通过`current`和`workInProgress`的替换，完成DOM更新