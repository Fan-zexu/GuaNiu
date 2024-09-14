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


所以这个是否可以解释“react中父组件更新，子组件默认也更新”

