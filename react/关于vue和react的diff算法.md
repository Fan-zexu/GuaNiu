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


## react diff



变更前后数据对比：

### 列表场景

1. 定义`index`表示更新后节点对应更新前节点的索引，`a`节点，对应的就是`_a`的索引是 0，也就是 `index === 0`

2. 定义`lastIndex`默认是0，如果通过`key`发现更新后节点，不能复用更新前节点，那么赋值`lastIndex = 0`。`lastIndex`更新逻辑是：`lastIndex = Max(lastIndex, index)`

通过`index < lastIndex` 来判断是否需要移动节点，这里的移动节点，指的是操作**真实DOM**的移动

#### 示例1：
前：`[_a, _b , _c]`; 其中`_`表示就节点

后: `[p, a, b , c]`

1. p节点，通过key无法复用p，所以创建 `lastIndex = 0`

2. a节点，通过key找到复用`_a`，所以`index = 0`，但由于`index(0) < lastIndex(0)`不满足，所以不移动。

3. 此时 `lastIndex = Max(lastIndex, index); // 结果是0`

4. b节点，通过key找到复用`_b`，所以`index = 1`，但由于`index(1) < lastIndex(0)`不满足，所以不移动。

5. 此时 `lastIndex = Max(lastIndex, index); // 结果是1`

3. 以此类推，发现`a b c`都不作出移动，所以结果只是需要创建一个新p节点，不需要移动节点。


## vue diff


# 疑问 ??

1. `diff`逻辑是否可以解释“react中父组件更新，子组件默认也更新”的难问题

