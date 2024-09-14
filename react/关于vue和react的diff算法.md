# vue react diff 算法

参考这篇「这波能反杀」大佬的文章 https://mp.weixin.qq.com/s/D_Yh4uTRTa8QeDZHR8KkMw

有个疑问：

文章提到一个点，在`React diff`中，比较两个节点，除了比较节点类型是否相同（比如`div`和`span`就是不同类型），还会对比`props state context`等外部传入参数是否相同。

比如如下两个节点，实际是对比函数参数是否一致

```js
count({ a: 1, b: 2 });

count({ a: 1, b: 2 })
```

即使参数对象`{a: 1, b: 2}`看着相同，但是两个对象是不同的内存地址，所以`{a: 1, b: 2} === {a: 1, b: 2} 是 false`

所以这看起来，任何节点对比，props都是不同的，那它的解决方案也有如下：

1. `react`中设计机制，如果判定元素节点的父节点没有发生变化，那就跳过`props`对比，从而提高性能

2. `React.memo`，这个api可以改变props对比规则，它接受一个组件声明作为参数

```js
function Count({ a: 1, b: 2 }) {}

export default React.memo(Count);
```

包裹之后，`props`参数对比规则就变成了依次对比第一层key对应的值

```js
// memo前：
{ a: 1, b: 1 } === { a: 1, b: 1 } // false

// memo后：
p0.a === p1.a && p0.b === p1.b // true
```



# 疑问 ??

1. `diff`逻辑是否可以解释“react中父组件更新，子组件默认也更新”的难问题

