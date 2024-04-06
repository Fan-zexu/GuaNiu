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


### 异常读取

```rs
let v = vec![1,2,3,4,5];

let not_exist = &v[100];

let not_exist = v.get(100);
```

第一种，`v[100]`超出范围，会是`rust panic`，导致程序崩溃

第二种，会返回一个`None`。当出现超出范围，也属于正常情况的场景，可以使用。接着，你可以使用`match`来处理这种异常。可以参考上面例子


异常场景：可变引用和不可变引用，同时出现在一个作用内

```rs
    let mut v = vec![1, 2, 3, 4, 5];

    let first = &v[0];

    v.push(6);

    println!("The first element is: {first}");

```

官网描述，异常原因：

> 为什么第一个元素的引用会关心 vector 结尾的变化？不能这么做的原因是由于 vector 的工作方式：在 vector 的结尾增加新元素时，在没有足够空间将所有元素依次相邻存放的情况下，可能会要求分配新内存并将老的元素拷贝到新的空间中。这时，第一个元素的引用就指向了被释放的内存。借用规则阻止程序陷入这种状况

可以这样改：

```rs

let mut v = vec![1, 2, 3, 4, 5];
v.push(6);
let first = &v[0];
println!("The first element is: {}", first);

```

## 遍历vector

```rs
let v = vec![1,2,3,4,5];

for i in &v {
    println!("i is {i}")
}

println!("i is {:?}", v)
```

使用可变引用，为每个元素增加1：

```rs
let mut v1 = vec![1,2,3,4,5];

for i in &mut v1 {
    *i += 1;
}    

println!("i is {:?}", v1);
```

第124行，这里需要使用`*`这个解引用运算符来获取`i`的值


## 使用枚举存储多种类型

使用枚举来定义多个不同类型的值，由于每个成员的类型都是这个枚举的类型，所以可以放在`vector`中使用

```rs
#[derive(Debug)]

enum CellMumbers {
    Int(i32),
    Float(f64),
    Text(String)
}

let cell = vec![
    CellMumbers::Int(3),
    CellMumbers::Float(10.12),
    CellMumbers::Text(String::from("blue"))
];

println!("cell is {:?}", cell);
```

