# Vector存储

类型是`Vec<T>`，可以存多个**类型相同**的值，且在内存中都彼此相邻的排列。

## 新建 vector

```rs
let vec: Vec<i32> = Vec::new();
```

新建一个空的`vector`来存储`i32`的值

为了方便，可以使用`vec宏`来创建，rust会自动推断类型

```rs
let vec = vec![1,2,3];
```
1,2,3是整型，所以推断为`i32`

## 更新 vector

使用`push`，向空vector中更新数据

```rs
let mut vec: Vec<i32> = Vec::new();

vec.push(5);
vec.push(6);
```

注意，想改变vec的值，需要使用`mut`关键字