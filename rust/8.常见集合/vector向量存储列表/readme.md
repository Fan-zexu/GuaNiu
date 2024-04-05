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

## 读取 vector元素

### 读取方式

两种方式：1. 通过索引 2. `get`方法

```rs
let v = vec![1,2,3,4,5];

let third: &i32 = &v[2];

println!("The third element is {third}");

let third = Option<&i32> = v.get(2);

match third {
    Option<third> => {
        println!("The third element is {third}")
    },
    None => println!("There is no third element.")
}
```

注意：

1. 使用`&`和`[]`，会得到一个索引位置元素的引用

2. 使用索引作为参数调用`get`方法，会得到一个可以用于`match`的`Option<&T>`